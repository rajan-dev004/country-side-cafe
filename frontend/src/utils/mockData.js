export const CATEGORIES = [
  { id: 'all', name: 'All Specialties' },
  { id: 'mains', name: 'Royal Mains' },
  { id: 'sweets', name: 'Desserts & Sweets' },
  { id: 'beverages', name: 'Beverages & Elixirs' },
  { id: 'starters', name: 'Heritage Starters' }
];

export const PRODUCTS = [
  {
    id: 1,
    name: 'Lavender Cardamom Lassi',
    category: 'beverages',
    price: 180,
    rating: 4.8,
    reviewsCount: 124,
    prepTime: '5 mins',
    tags: ['Best Seller', 'Refreshing', 'Lavender Special'],
    description: 'A soothing and refreshing traditional yogurt-based drink infused with dried culinary French lavender buds and green cardamom, topped with crushed pistachios and edible rose petals.',
    ingredients: ['Greek Yogurt', 'Lavender Syrup', 'Cardamom Powder', 'Honey', 'Pistachios', 'Rose Petals'],
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 2,
    name: 'Ker Sangri Risotto',
    category: 'mains',
    price: 450,
    rating: 4.9,
    reviewsCount: 89,
    prepTime: '25 mins',
    tags: ['Signature', 'Royal Fusion', 'Spicy'],
    description: 'An elegant Italian-Rajasthani fusion dish featuring creamy Arborio rice simmered with dried dessert berries (Ker) and wild beans (Sangri), finished with aged Parmesan, white wine, and a pinch of hand-ground mathania chillies.',
    ingredients: ['Arborio Rice', 'Ker Berry', 'Sangri Beans', 'Parmesan Cheese', 'Mathania Red Chilli', 'White Wine', 'Garlic'],
    image: 'https://images.unsplash.com/photo-1545093149-618ce3bcf49d?w=600&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 3,
    name: 'Masala Chai Creme Brulee',
    category: 'sweets',
    price: 260,
    rating: 4.7,
    reviewsCount: 156,
    prepTime: '15 mins',
    tags: ['Must Try', 'Sweet Spice'],
    description: 'A classic French dessert with a rich custard base flavored with black tea, ginger, cardamom, and cinnamon, topped with a hard, caramelized sugar crust.',
    ingredients: ['Heavy Cream', 'Egg Yolks', 'Assam Black Tea', 'Fresh Ginger', 'Cardamom', 'Cinnamon', 'Caramelized Sugar'],
    image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 4,
    name: 'Paneer Tikka Tacos',
    category: 'starters',
    price: 320,
    rating: 4.6,
    reviewsCount: 95,
    prepTime: '12 mins',
    tags: ['Popular', 'Vegetarian'],
    description: 'Soft flour tortillas filled with clay-oven roasted cottage cheese cubes marinated in yogurt spices, layered with crunchy cabbage slaw, mint chutney, and lavender-infused pickled onions.',
    ingredients: ['Paneer (Cottage Cheese)', 'Tortillas', 'Yogurt Marinade', 'Mint Chutney', 'Cabbage Slaw', 'Lavender Pickled Onions'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    featured: false
  },
  {
    id: 5,
    name: 'Saffron Rose Panna Cotta',
    category: 'sweets',
    price: 290,
    rating: 4.9,
    reviewsCount: 74,
    prepTime: '10 mins',
    tags: ['Delicate', 'Floral'],
    description: 'Silky and light Italian gelatin dessert infused with Kashmiri saffron strands and organic rose water, served with a berry coulis and lavender syrup drizzle.',
    ingredients: ['Milk & Cream', 'Kashmiri Saffron', 'Rose Water', 'Gelatin', 'Lavender Syrup', 'Mixed Berries'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 6,
    name: 'Lal Maas Slider',
    category: 'starters',
    price: 380,
    rating: 4.8,
    reviewsCount: 112,
    prepTime: '18 mins',
    tags: ['Spicy', 'Non-Veg'],
    description: 'Shredded slow-cooked tender lamb in a fiery Mathania red chili gravy, served in warm buttered brioche slider buns with cucumber raita drizzle.',
    ingredients: ['Tender Lamb', 'Mathania Chillies', 'Brioche Buns', 'Spices', 'Yogurt', 'Cucumber'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    featured: false
  },
  {
    id: 7,
    name: 'Blueberry Elderflower Iced Tea',
    category: 'beverages',
    price: 190,
    rating: 4.5,
    reviewsCount: 63,
    prepTime: '5 mins',
    tags: ['Cold Brew', 'Fruity'],
    description: 'Refreshing cold-brewed Darjeeling black tea sweetened with blueberry purée and floral elderflower syrup, garnished with fresh lavender stems.',
    ingredients: ['Darjeeling Tea', 'Blueberry Purée', 'Elderflower Syrup', 'Lemon Juice', 'Fresh Lavender'],
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80',
    featured: false
  },
  {
    id: 8,
    name: 'Rajasthani Govind Gatta Curry',
    category: 'mains',
    price: 410,
    rating: 4.7,
    reviewsCount: 82,
    prepTime: '22 mins',
    tags: ['Authentic', 'Hearty'],
    description: 'Melt-in-the-mouth chickpea flour dumplings stuffed with nuts, saffron, and crumbled paneer, simmered in a rich, tangy yogurt and onion gravy.',
    ingredients: ['Besan (Chickpea Flour)', 'Paneer', 'Cashews & Raisins', 'Yogurt', 'Onion & Tomato Gravy', 'Saffron'],
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
    featured: false
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aishwarya Singh',
    role: 'Food Critic',
    comment: 'The Ker Sangri Risotto is an absolute culinary masterpiece. The addition of lavender cardamom lassi cleansed my palate beautifully. Exceptional design and vibe!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Rohan Sharma',
    role: 'Local Patron',
    comment: 'I love coming here on weekends. The fusion menu is fresh, and the Lavender-Honey-Berry color palette of the cafe translates beautifully to their digital menu. Super fast ordering!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Sarah Mitchell',
    role: 'Travel Vlogger',
    comment: 'A gorgeous gem in Rajasthan! Their Masala Chai Creme Brulee is worth traveling for. The mobile ordering experience is so slick and responsive.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80'
  }
];
