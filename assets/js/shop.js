from bs4 import BeautifulSoup
import requests
from os import environ
import lxml


headers = {
    "User-Agent": environ.get("User-Agent"),
    "Accept-Language": environ.get("Accept-Language")
}

amazon_link_address = "https://amzn.to/4eZ0PmY"
response = requests.get(url=amazon_link_address, headers=headers)

soup = BeautifulSoup(response.content, features="lxml")

price = soup.find_all("span")
for i in price:
    try:
        if i['class'] == ['a-price-whole']:
            itemPrice = f"${str(i.get_text())[:-1]}"
            break
    except KeyError:
        continue

print(itemPrice)