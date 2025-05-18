// prisma/seed.ts
import { PrismaClient as prismaData } from '@prisma/client';  // Use import instead of require

const prisma = new prismaData();

async function main2() {
    // Seed User data
    const user1 = await prisma.user.create({
        data: {
            nama: 'John Doe',
            alamat: '123 Main St',
            tempatLahir: 'New York',
            tanggalLahir: new Date('1990-01-01'),
        },
    });

    const user2 = await prisma.user.create({
        data: {
            nama: 'Jane Smith',
            alamat: '456 Oak St',
            tempatLahir: 'Los Angeles',
            tanggalLahir: new Date('1985-05-15'),
        },
    });

    const user3 = await prisma.user.create({
        data: {
            nama: 'Jack Brown',
            alamat: '789 Pine St',
            tempatLahir: 'Chicago',
            tanggalLahir: new Date('1992-08-23'),
        },
    });

    // Seed Login data (Note: use `userId` instead of `user_id`)
    const login1 = await prisma.login.create({
        data: {
            username: 'user1@mail.com',
            password: 'password123', // You should hash the password in a real-world app
            userId: user1.id, // Reference userId
        },
    });

    const login2 = await prisma.login.create({
        data: {
            username: 'user2@mail.com',
            password: 'password456', // You should hash the password in a real-world app
            userId: user2.id, // Reference userId
        },
    });

    const login3 = await prisma.login.create({
        data: {
            username: 'user3@mail.com',
            password: 'password789', // You should hash the password in a real-world app
            userId: user3.id, // Reference userId
        },
    });

    console.log('Seeded login and user data:', { login1, login2, login3, user1, user2, user3 });
}

main2()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
