import os
import requests
import xmltodict
import time
import database.main as database
import buzzsneakers.utils as utils
from buzzsneakers.get_product import get_product
from buzzsneakers.types import Thread, ProductManager
from dotenv import load_dotenv
load_dotenv()
def backend(_, parentThread: Thread):
    while True:
        try:
            time.sleep(60)
            keywords = ["asics"]
            try:
                url = os.getenv("PRODUCTS_API_URL")
                response = requests.get(url)
            except requests.exceptions.ConnectionError or requests.exceptions.ConnectTimeout:
                print("[BACKEND] Connection error.")
                continue
       
            if response.status_code != 200:
                print("[BACKEND] Failed to fetch data.")
                continue
            try:
                data = xmltodict.parse(response.text)
            except xmltodict.expat.ExpatError:
                print("[BACKEND] Error parsing XML.")
                continue
            if not data["urlset"].get("url"):
                print("[BACKEND] No links found.")
                continue
           
            for url in data["urlset"]["url"]:
                loc = url["loc"].strip().lower()
                if "tenisky" in loc and any(keyword in loc for keyword in keywords):
                    pid = utils.GetPIDFromLink(url["loc"])
                    if not database.get_product(pid):
                        product_data = get_product(pid)
                        if not product_data["flag"]:
                            continue  
                            
                        product_json = ProductManager().build(product_data)
                        database.add_product_to_db(product_json)
                        
                        utils.SendWebhook(product_data, os.getenv("WEBHOOK_URL"), True)
                        
                        print("[BACKEND] Added to database. {}".format(pid))
                        
                    continue
            break
        except Exception as e:
            print("[BACKEND] Error: {}".format(e))
            continue