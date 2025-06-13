import {Category} from '../models/Category.js';
import { connectionToDB } from '../db.js';

const main = async () => {
    const categories = [
                { name: 'Electronics' },
                { name: 'Books' },
                { name: 'Clothing' },
                { name: 'Home & Kitchen' },
                { name: 'Sports & Outdoors' },
                { name: 'Toys & Games' },
                { name: 'Health & Beauty' },
                { name: 'Automotive' },
                { name: 'Grocery & Gourmet Food' },
                { name: 'Pet Supplies' },
                { name: 'Office & Stationery' },
                { name: 'Mobile Phones & Accessories' },
                { name: 'Laptops & Computer Gear' },
                { name: 'Watches & Wearables' },
                { name: 'Footwear' },
                { name: 'Home Decor & Lighting' },
                { name: 'Kitchen Tools & Dining' },
                { name: 'Men’s Fashion' },
                { name: 'Women’s Fashion' },
                { name: 'Baby & Kids Essentials' }
            ];
    try {
        await connectionToDB('mongodb+srv://patelvraju07:6ZGSGVaIxwIDbNhz@cluster0.q59yukc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        await Category.deleteMany({}); // Clear existing categories
        await Category.insertMany(categories); // Insert new categories
        console.log('Categories seeded successfully');
    } catch (error) {
        console.error('Error seeding categories:', error);
    }

}

main()
.then(() => {
    console.log('Seeding completed');
    process.exit(0);
})
.catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});