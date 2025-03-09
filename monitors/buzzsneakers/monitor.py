import json
import os
from buzzsneakers.get_product import get_product
import database.main as database
import buzzsneakers.utils as utils
from buzzsneakers.types import Thread, ProductManager
from dotenv import load_dotenv
load_dotenv()

webhook = os.getenv("WEBHOOK_URL")

def monitor(pid: str, parentThread: Thread):
    print('[{}] Starting thread.'.format(pid))

    while not parentThread.stop:
        data = get_product(pid)
        if not data["flag"]:
            print(f"[{pid}] Product not found.")

            if database.get_product(pid):
                database.delete_product(pid)

                for size in data["sizes"]:
                    database.delete_size(size["combId"])

                print(f"[{pid}] Product removed from database.")
                
                return
            return

        if not database.get_product(pid):
            print(f"[{pid}] Product added to database.")

            product = ProductManager.build(data)
            database.add_product_to_db(product)
            utils.SendWebhook(data, webhook, True)
            

        else:
            isInstock = utils.GetStockBool(data)

            if not isInstock:
                return

            product = json.loads(ProductManager.build(data))

            current_price = product["price"]
            old_price = database.get_product(pid)[3]

            if old_price != current_price:
                print('[{}] Price has changed. ({} -> {})'.format(pid, old_price, current_price))

                try:
                    utils.SendWebhook(data, webhook, False)
                    database.update_product_price(pid, current_price)
                    
                except Exception as e:
                    print(f"[{pid}] Failed to update price: {e}")

            old_quantity = database.get_product(pid)[5]
            current_quantity = product["quantity"]

            if old_quantity != current_quantity:
                print('[{}] Quantity has changed. ({} -> {})'.format(pid, old_quantity, current_quantity))

                current_sizes = product["sizes"]
                size_updates = []

                for current_size in current_sizes:
                    size = database.get_size(current_size["combId"])

                    if not size:
                        database.add_size(current_size["combId"], pid, current_size["stock"], current_size["name"], True)
                        print(f"[{pid}] Size added to database.")
                        size_updates.append({
                            'combId': current_size["combId"],
                            'action': 'added',
                            'name': current_size["name"],
                            'stock': current_size["stock"]
                        })

                    else:
                        old_stock = float(size[2])
                        current_stock = float(current_size["stock"])

                        if old_stock != current_stock:
                            if (old_stock > 0 and current_stock == 0) or (old_stock == 0 and current_stock > 0):
                                print('[{} - {}] Quantity has changed for variant. ({} -> {})'.format(pid, current_size["combId"], old_stock, current_stock))

                                if bool(utils.GetStockBoolSizeStock(current_size)):
                                    utils.SendWebhook(data, webhook, False)
                                database.find_size_and_update_stock(pid, current_size["combId"], current_stock)
                                
                                size_updates.append({
                                    'combId': current_size["combId"],
                                    'action': 'updated',
                                    'name': current_size["name"],
                                    'old_stock': old_stock,
                                    'new_stock': current_stock
                                })

                database.update_product_quantity(pid, current_quantity)
                