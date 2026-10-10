export type Product = {
	id: number;
	name: string;
	brand: string;
	category: string;
	price: number;
	description: string;
	image: string;
	gallery: string[];
	skinTypes: string[];
	concerns: string[];
	featured: boolean;
};

export const products: Product[] = [
	{
		id: 1,
		name: 'Gentle Cream Cleanser',
		brand: 'Pure Form',
		category: 'Cleansers',
		price: 16000,
		description: 'A gentle daily cleanser that leaves skin feeling fresh and comfortable.',
		image:
			'https://images.unsplash.com/photo-1687293375398-65aadbb792d1?auto=format&fit=crop&w=800&q=85',
		gallery: [
			'https://images.unsplash.com/photo-1687293375398-65aadbb792d1?auto=format&fit=crop&w=800&q=85',
			'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=85'
		],
		skinTypes: ['Normal', 'Combination', 'Oily'],
		concerns: ['Daily cleansing', 'Excess shine'],
		featured: true
	},
	{
		id: 2,
		name: 'Daily Barrier Moisturiser',
		brand: 'Skin Ritual',
		category: 'Moisturisers',
		price: 22000,
		description: 'A nourishing daily cream to keep skin feeling soft and supported.',
		image:
			'https://images.unsplash.com/photo-1704297004675-b2532b947c65?auto=format&fit=crop&w=800&q=85',
		gallery: [
			'https://images.unsplash.com/photo-1704297004675-b2532b947c65?auto=format&fit=crop&w=800&q=85',
			'https://images.unsplash.com/photo-1638609927252-9982beed7af8?auto=format&fit=crop&w=800&q=85'
		],
		skinTypes: ['Dry', 'Normal'],
		concerns: ['Dryness', 'Daily hydration'],
		featured: false
	},
	{
		id: 3,
		name: 'Brightening Facial Serum',
		brand: 'The Glow Edit',
		category: 'Serums',
		price: 18500,
		description: 'A lightweight serum for a brighter-looking, more even complexion.',
		image:
			'https://images.unsplash.com/photo-1713768704571-6aeb0d0e5105?auto=format&fit=crop&w=800&q=85',
		gallery: [
			'https://images.unsplash.com/photo-1713768704571-6aeb0d0e5105?auto=format&fit=crop&w=800&q=85',
			'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85'
		],
		skinTypes: ['Normal', 'Dry', 'Combination'],
		concerns: ['Uneven-looking tone', 'Dullness'],
		featured: true
	},
	{
		id: 4,
		name: 'Everyday SPF 50 Sunscreen',
		brand: 'Glow Theory',
		category: 'Sun Care',
		price: 25000,
		description:
			'A lightweight sunscreen for daily protection as the final step in your morning routine.',
		image:
			'https://images.unsplash.com/photo-1744117613898-de25c10ed551?auto=format&fit=crop&w=800&q=85',
		gallery: [
			'https://images.unsplash.com/photo-1744117613898-de25c10ed551?auto=format&fit=crop&w=800&q=85',
			'https://images.unsplash.com/photo-1738721796993-5f42d9315689?auto=format&fit=crop&w=800&q=85'
		],
		skinTypes: ['All skin types'],
		concerns: ['Daily sun protection'],
		featured: true
	},
	{
		id: 5,
		name: 'Hydrating Facial Toner',
		brand: 'Pure Form',
		category: 'Toners',
		price: 14500,
		description: 'A refreshing toner that adds a light layer of hydration after cleansing.',
		image:
			'https://images.unsplash.com/photo-1599847987657-881f11b92a75?auto=format&fit=crop&w=800&q=85',
		gallery: [
			'https://images.unsplash.com/photo-1599847987657-881f11b92a75?auto=format&fit=crop&w=800&q=85',
			'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=85'
		],
		skinTypes: ['Dry', 'Normal', 'Combination'],
		concerns: ['Dryness', 'Daily hydration'],
		featured: false
	},
	{
		id: 6,
		name: 'Soothing Overnight Mask',
		brand: 'Skin Ritual',
		category: 'Masks',
		price: 19500,
		description: 'A comforting leave-on mask for an easy, moisture-focused evening ritual.',
		image:
			'https://images.unsplash.com/photo-1693004927824-f2623bbedc8b?auto=format&fit=crop&w=800&q=85',
		gallery: [
			'https://images.unsplash.com/photo-1693004927824-f2623bbedc8b?auto=format&fit=crop&w=800&q=85',
			'https://images.unsplash.com/photo-1648203276014-20f97ba1f817?auto=format&fit=crop&w=800&q=85'
		],
		skinTypes: ['Dry', 'Normal'],
		concerns: ['Dryness', 'Evening care'],
		featured: true
	},
	{
		id: 7,
		name: 'Cooling Eye Gel',
		brand: 'Glow Theory',
		category: 'Eye Care',
		price: 21000,
		description: 'A lightweight gel made for the delicate skin around the eyes.',
		image:
			'https://images.unsplash.com/photo-1643379855542-82c0c7483f3a?auto=format&fit=crop&w=800&q=85',
		gallery: [
			'https://images.unsplash.com/photo-1643379855542-82c0c7483f3a?auto=format&fit=crop&w=800&q=85',
			'https://images.unsplash.com/photo-1646683872419-d5a50258d4d9?auto=format&fit=crop&w=800&q=85'
		],
		skinTypes: ['All skin types'],
		concerns: ['Under-eye care'],
		featured: false
	},
	{
		id: 8,
		name: 'Softening Body Lotion',
		brand: 'Glow Theory',
		category: 'Body Care',
		price: 12000,
		description: 'A daily body lotion that helps leave skin feeling smooth and replenished.',
		image:
			'https://images.unsplash.com/photo-1498843053639-170ff2122f35?auto=format&fit=crop&w=800&q=85',
		gallery: [
			'https://images.unsplash.com/photo-1498843053639-170ff2122f35?auto=format&fit=crop&w=800&q=85',
			'https://images.unsplash.com/photo-1703174323653-0455deaf7f11?auto=format&fit=crop&w=800&q=85'
		],
		skinTypes: ['All skin types'],
		concerns: ['Body dryness', 'Daily hydration'],
		featured: false
	}
];
