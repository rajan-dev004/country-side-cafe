from django.core.management.base import BaseCommand
from products.models import Category, Product

class Command(BaseCommand):
    help = 'Seeds initial categories and products matching the frontend mock data.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding categories...')
        
        categories_data = [
            {'id': 'mains', 'name': 'Royal Mains'},
            {'id': 'sweets', 'name': 'Desserts & Sweets'},
            {'id': 'beverages', 'name': 'Beverages & Elixirs'},
            {'id': 'starters', 'name': 'Heritage Starters'},
        ]

        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(id=cat_data['id'], defaults={'name': cat_data['name']})
            if created:
                self.stdout.write(f"Created category: {cat.name}")
            else:
                self.stdout.write(f"Category {cat.name} already exists.")

        self.stdout.write('Seeding products...')
        
        products_data = [
            {
                'id': 1,
                'name': 'Lavender Cardamom Lassi',
                'category_id': 'beverages',
                'price': 180,
                'rating': 4.8,
                'reviewsCount': 124,
                'prepTime': '5 mins',
                'tags': ['Best Seller', 'Refreshing', 'Lavender Special'],
                'description': 'A soothing and refreshing traditional yogurt-based drink infused with dried culinary French lavender buds and green cardamom, topped with crushed pistachios and edible rose petals.',
                'ingredients': ['Greek Yogurt', 'Lavender Syrup', 'Cardamom Powder', 'Honey', 'Pistachios', 'Rose Petals'],
                'image': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
                'featured': True
            },
            {
                'id': 2,
                'name': 'Ker Sangri Risotto',
                'category_id': 'mains',
                'price': 450,
                'rating': 4.9,
                'reviewsCount': 89,
                'prepTime': '25 mins',
                'tags': ['Signature', 'Royal Fusion', 'Spicy'],
                'description': 'An elegant Italian-Rajasthani fusion dish featuring creamy Arborio rice simmered with dried dessert berries (Ker) and wild beans (Sangri), finished with aged Parmesan, white wine, and a pinch of hand-ground mathania chillies.',
                'ingredients': ['Arborio Rice', 'Ker Berry', 'Sangri Beans', 'Parmesan Cheese', 'Mathania Red Chilli', 'White Wine', 'Garlic'],
                'image': 'https://images.unsplash.com/photo-1545093149-618ce3bcf49d?w=600&auto=format&fit=crop&q=80',
                'featured': True
            },
            {
                'id': 3,
                'name': 'Masala Chai Creme Brulee',
                'category_id': 'sweets',
                'price': 260,
                'rating': 4.7,
                'reviewsCount': 156,
                'prepTime': '15 mins',
                'tags': ['Must Try', 'Sweet Spice'],
                'description': 'A classic French dessert with a rich custard base flavored with black tea, ginger, cardamom, and cinnamon, topped with a hard, caramelized sugar crust.',
                'ingredients': ['Heavy Cream', 'Egg Yolks', 'Assam Black Tea', 'Fresh Ginger', 'Cardamom', 'Cinnamon', 'Caramelized Sugar'],
                'image': 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600&auto=format&fit=crop&q=80',
                'featured': True
            },
            {
                'id': 4,
                'name': 'Paneer Tikka Tacos',
                'category_id': 'starters',
                'price': 320,
                'rating': 4.6,
                'reviewsCount': 95,
                'prepTime': '12 mins',
                'tags': ['Popular', 'Vegetarian'],
                'description': 'Soft flour tortillas filled with clay-oven roasted cottage cheese cubes marinated in yogurt spices, layered with crunchy cabbage slaw, mint chutney, and lavender-infused pickled onions.',
                'ingredients': ['Paneer (Cottage Cheese)', 'Tortillas', 'Yogurt Marinade', 'Mint Chutney', 'Cabbage Slaw', 'Lavender Pickled Onions'],
                'image': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
                'featured': False
            },
            {
                'id': 5,
                'name': 'Saffron Rose Panna Cotta',
                'category_id': 'sweets',
                'price': 290,
                'rating': 4.9,
                'reviewsCount': 74,
                'prepTime': '10 mins',
                'tags': ['Delicate', 'Floral'],
                'description': 'Silky and light Italian gelatin dessert infused with Kashmiri saffron strands and organic rose water, served with a berry coulis and lavender syrup drizzle.',
                'ingredients': ['Milk & Cream', 'Kashmiri Saffron', 'Rose Water', 'Gelatin', 'Lavender Syrup', 'Mixed Berries'],
                'image': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
                'featured': True
            },
            {
                'id': 6,
                'name': 'Lal Maas Slider',
                'category_id': 'starters',
                'price': 380,
                'rating': 4.8,
                'reviewsCount': 112,
                'prepTime': '18 mins',
                'tags': ['Spicy', 'Non-Veg'],
                'description': 'Shredded slow-cooked tender lamb in a fiery Mathania red chili gravy, served in warm buttered brioche slider buns with cucumber raita drizzle.',
                'ingredients': ['Tender Lamb', 'Mathania Chillies', 'Brioche Buns', 'Spices', 'Yogurt', 'Cucumber'],
                'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
                'featured': False
            },
            {
                'id': 7,
                'name': 'Blueberry Elderflower Iced Tea',
                'category_id': 'beverages',
                'price': 190,
                'rating': 4.5,
                'reviewsCount': 63,
                'prepTime': '5 mins',
                'tags': ['Cold Brew', 'Fruity'],
                'description': 'Refreshing cold-brewed Darjeeling black tea sweetened with blueberry purée and floral elderflower syrup, garnished with fresh lavender stems.',
                'ingredients': ['Darjeeling Tea', 'Blueberry Purée', 'Elderflower Syrup', 'Lemon Juice', 'Fresh Lavender'],
                'image': 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80',
                'featured': False
            },
            {
                'id': 8,
                'name': 'Rajasthani Govind Gatta Curry',
                'category_id': 'mains',
                'price': 410,
                'rating': 4.7,
                'reviewsCount': 82,
                'prepTime': '22 mins',
                'tags': ['Authentic', 'Hearty'],
                'description': 'Melt-in-the-mouth chickpea flour dumplings stuffed with nuts, saffron, and crumbled paneer, simmered in a rich, tangy yogurt and onion gravy.',
                'ingredients': ['Besan (Chickpea Flour)', 'Paneer', 'Cashews & Raisins', 'Yogurt', 'Onion & Tomato Gravy', 'Saffron'],
                'image': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
                'featured': False
            }
        ]

        for prod_data in products_data:
            prod, created = Product.objects.update_or_create(
                id=prod_data['id'],
                defaults={
                    'name': prod_data['name'],
                    'category_id': prod_data['category_id'],
                    'price': prod_data['price'],
                    'rating': prod_data['rating'],
                    'reviewsCount': prod_data['reviewsCount'],
                    'prepTime': prod_data['prepTime'],
                    'tags': prod_data['tags'],
                    'description': prod_data['description'],
                    'ingredients': prod_data['ingredients'],
                    'image': prod_data['image'],
                    'featured': prod_data['featured']
                }
            )
            if created:
                self.stdout.write(f"Created product: {prod.name}")
            else:
                self.stdout.write(f"Updated product: {prod.name}")

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
