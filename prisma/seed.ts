import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create initial countries
    const slovenia = await prisma.country.upsert({
        where: { code: 'SI' },
        update: {},
        create: {
            name: 'Slovenia',
            code: 'SI',
        },
    });

    const germany = await prisma.country.upsert({
        where: { code: 'DE' },
        update: {},
        create: {
            name: 'Germany',
            code: 'DE',
        },
    });

    // Create initial users
    await prisma.user.upsert({
        where: { email: 'janez.novak@gmail.com' },
        update: {},
        create: {
            name: 'Janez Novak',
            email: 'janez.novak@gmail.com',
            countryId: slovenia.id,
        },
    });

    await prisma.user.upsert({
        where: { email: 'marija.horvat@gmail.com' },
        update: {},
        create: {
            name: 'Marija Horvat',
            email: 'marija.horvat@gmail.com',
            countryId: slovenia.id,
        },
    });

    await prisma.user.upsert({
        where: { email: 'peter.schimdt@gmail.com' },
        update: {},
        create: {
            name: 'Peter Schimdt',
            email: 'peter.schimdt@gmail.com',
            countryId: germany.id,
        },
    });

    console.log('Database has been seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
