import  prisma  from '../src/lib/prisma.ts';

async function main() {
    await prisma.wishlist.create({
        data: {
            name: 'Template Wishlist',
            eventDate: new Date(),
        },
    });

    console.log('Template wishlist created');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
