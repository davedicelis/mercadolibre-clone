#!/usr/bin/env python3
import json
from collections import Counter, defaultdict

# Cargar datos de productos
with open('app/data/products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

products = data['products']

# Analizar vendedores
sellers = defaultdict(list)
for product in products:
    seller_name = product['seller']['name']
    sellers[seller_name].append({
        'id': product['id'],
        'title': product['title'][:50] + '...' if len(product['title']) > 50 else product['title']
    })

print("ANÁLISIS DE PRODUCTOS POR VENDEDOR")
print("=" * 50)
print(f"Total productos: {len(products)}")
print(f"Total vendedores: {len(sellers)}")
print()

# Mostrar vendedores y sus productos
for seller_name, seller_products in sorted(sellers.items()):
    print(f"{seller_name}: {len(seller_products)} productos")
    for product in seller_products:
        print(f"  - ID {product['id']}: {product['title']}")
    print()

# Vendedores con menos de 3 productos
insufficient_sellers = {k: v for k, v in sellers.items() if len(v) < 3}
print("VENDEDORES CON MENOS DE 3 PRODUCTOS:")
print("=" * 40)
for seller_name, seller_products in insufficient_sellers.items():
    print(f"{seller_name}: {len(seller_products)} productos (necesita {3 - len(seller_products)} más)")