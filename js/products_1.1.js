// Product data
const products = [
    // Burgers
    {
        id: 1,
        name: "Classic Burger",
        category: "burgers",
        price: 450,
        originalPrice: 1999,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Juicy beef patty with fresh vegetables and special sauce",
        rating: 4.5,
        isPopular: true
    },
    {
        id: 2,
        name: "Cheese Burger",
        category: "burgers",
        price: 550,
        originalPrice: 2199,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Classic burger with melted cheese and crispy bacon",
        rating: 4.7,
        isPopular: true
    },
    {
        id: 3,
        name: "Chicken Burger",
        category: "burgers",
        price: 500,
        originalPrice: 1799,
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Grilled chicken patty with lettuce and mayo",
        rating: 4.3,
        isPopular: false
    },
    {
        id: 4,
        name: "Veggie Burger",
        category: "burgers",
        price: 1299,
        originalPrice: 1599,
        image: "https://images.unsplash.com/photo-1605470034288-094b1c06241b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Plant-based patty with fresh vegetables and vegan sauce",
        rating: 4.2,
        isPopular: false
    },

    // Sides
    {
        id: 5,
        name: "French Fries",
        category: "sides",
        price: 200,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Crispy golden fries with seasoning",
        rating: 4.2,
        isPopular: false
    },
    {
        id: 6,
        name: "Onion Rings",
        category: "sides",
        price: 250,
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Crispy battered onion rings",
        rating: 4.0,
        isPopular: false
    },
    {
        id: 7,
        name: "Chicken Wings",
        category: "sides",
        price: 600,
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Spicy buffalo wings with dipping sauce",
        rating: 4.6,
        isPopular: true
    },
    {
        id: 8,
        name: "Mozzarella Sticks",
        category: "sides",
        price: 449,
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Breaded mozzarella sticks served with marinara sauce",
        rating: 4.3,
        isPopular: false
    },

    // Drinks
    {
        id: 9,
        name: "Cola",
        category: "drinks",
        price: 100,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Refreshing carbonated drink",
        rating: 4.0,
        isPopular: false
    },
    {
        id: 10,
        name: "Milkshake",
        category: "drinks",
        price: 250,
        image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Creamy chocolate milkshake",
        rating: 4.4,
        isPopular: false
    },
    {
        id: 11,
        name: "Lemonade",
        category: "drinks",
        price: 150,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Fresh squeezed lemonade",
        rating: 4.1,
        isPopular: false
    },
    {
        id: 12,
        name: "Fresh Lemonade",
        category: "drinks",
        price: 249,
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Freshly squeezed lemonade with mint leaves",
        rating: 4.6,
        isPopular: true
    }
];

// Make products array globally accessible
window.products = products;

// Export the products array
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products };
} 