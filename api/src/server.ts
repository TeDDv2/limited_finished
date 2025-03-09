import { createApp } from "./utils/createApp";

const PORT = process.env.PORT;

(async () => {
    try {
        const { app, io } = await createApp();
        const server = app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`)
        })

        io.attach(server)

    } catch (error) {
        console.error(error);
    }
})();