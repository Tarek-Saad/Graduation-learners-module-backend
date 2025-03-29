## Exposing API using ngrok  
If you need external access to this API without running it locally, follow these steps:  

1. Start the API server on your machine (Example: `node server.js` or `python app.py`).  
2. Install ngrok if you haven’t
3. Run ngrok with the API port:
   ```sh
   ngrok http 5000  # Replace 5000 with your actual server port  
