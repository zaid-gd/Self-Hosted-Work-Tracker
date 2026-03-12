import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const seedUserId = process.env.SEED_USER_ID || "demo_user"
  console.log(`Seeding database for ${seedUserId}...`)

  await prisma.projectAttachment.deleteMany()
  await prisma.project.deleteMany()
  await prisma.client.deleteMany()

  const clients = await Promise.all([
    prisma.client.create({
      data: {
        userId: seedUserId,
        name: "Sharma Productions",
        contactEmail: "sharma@productions.in",
        notes: "Wedding specialists, Rajasthan. Pays on delivery.",
      },
    }),
    prisma.client.create({
      data: {
        userId: seedUserId,
        name: "Dream Frames Studio",
        contactEmail: "hello@dreamframes.in",
        notes: "Corporate and product videos. Monthly billing.",
      },
    }),
    prisma.client.create({
      data: {
        userId: seedUserId,
        name: "Reels by Rohan",
        contactEmail: "rohan@reelsby.me",
        notes: "Instagram reels creator. Quick turnaround needed.",
      },
    }),
    prisma.client.create({
      data: {
        userId: seedUserId,
        name: "Vrindavan Films",
        contactEmail: null,
        notes: "Long-form documentary films. Salary arrangement.",
      },
    }),
  ])

  const [sharma, dreamframes, reels, vrindavan] = clients
  const now = new Date()
  const past = (days: number) => new Date(now.getTime() - days * 86400000)
  const future = (days: number) => new Date(now.getTime() + days * 86400000)

  await prisma.project.createMany({
    data: [
      {
        userId: seedUserId,
        title: "Mehra Wedding Highlight Film",
        clientId: sharma.id,
        status: "DELIVERED",
        paymentType: "PAID_ADVANCE",
        agreedAmount: 18000,
        currency: "INR",
        isPaid: true,
        tags: "wedding,highlight,4k",
        notes: "3-min highlight and teaser reel. Delivered on time.",
        dueDate: past(20),
        completedAt: past(22),
      },
      {
        userId: seedUserId,
        title: "Gupta Engagement Teaser",
        clientId: sharma.id,
        status: "DELIVERED",
        paymentType: "UNPAID",
        agreedAmount: 8000,
        currency: "INR",
        isPaid: false,
        tags: "engagement,teaser",
        notes: "Payment pending since delivery.",
        dueDate: past(10),
        completedAt: past(12),
      },
      {
        userId: seedUserId,
        title: "Patel Pre-Wedding Reel",
        clientId: sharma.id,
        status: "IN_PROGRESS",
        paymentType: "PAID_ADVANCE",
        agreedAmount: 12000,
        currency: "INR",
        isPaid: false,
        tags: "pre-wedding,reel",
        notes: "50 percent advance received. Edit in progress.",
        dueDate: future(7),
        completedAt: null,
      },
      {
        userId: seedUserId,
        title: "Shah Anniversary Film",
        clientId: sharma.id,
        status: "PLANNED",
        paymentType: "UNPAID",
        agreedAmount: 15000,
        currency: "INR",
        isPaid: false,
        tags: "anniversary,highlight",
        notes: "Footage to be received next week.",
        dueDate: future(21),
        completedAt: null,
      },
      {
        userId: seedUserId,
        title: "TechCorp Product Launch - Q1",
        clientId: dreamframes.id,
        status: "DELIVERED",
        paymentType: "PAID_ADVANCE",
        agreedAmount: 35000,
        currency: "INR",
        isPaid: true,
        tags: "corporate,product,launch",
        notes: "3-video series. Full payment received.",
        dueDate: past(45),
        completedAt: past(47),
      },
      {
        userId: seedUserId,
        title: "UrbanEats Brand Video",
        clientId: dreamframes.id,
        status: "IN_PROGRESS",
        paymentType: "PAID_ADVANCE",
        agreedAmount: 22000,
        currency: "INR",
        isPaid: false,
        tags: "brand,food,corporate",
        notes: "2-minute product video and social cuts.",
        dueDate: future(14),
        completedAt: null,
      },
      {
        userId: seedUserId,
        title: "GreenTech CSR Documentary",
        clientId: dreamframes.id,
        status: "PLANNED",
        paymentType: "UNPAID",
        agreedAmount: 45000,
        currency: "INR",
        isPaid: false,
        tags: "documentary,csr",
        notes: "Shooting starts next month. Long form around 20 minutes.",
        dueDate: future(60),
        completedAt: null,
      },
      {
        userId: seedUserId,
        title: "Monthly Social Pack - February",
        clientId: dreamframes.id,
        status: "DELIVERED",
        paymentType: "PAID_ADVANCE",
        agreedAmount: 12000,
        currency: "INR",
        isPaid: true,
        tags: "social,monthly,reels",
        notes: "10 reels and 5 stories. Ongoing retainer.",
        dueDate: past(15),
        completedAt: past(14),
      },
      {
        userId: seedUserId,
        title: "Weekly Reels Batch #1",
        clientId: reels.id,
        status: "DELIVERED",
        paymentType: "PAID_ADVANCE",
        agreedAmount: 4500,
        currency: "INR",
        isPaid: true,
        tags: "reels,instagram,batch",
        notes: "5 reels for the week.",
        dueDate: past(5),
        completedAt: past(6),
      },
      {
        userId: seedUserId,
        title: "Weekly Reels Batch #2",
        clientId: reels.id,
        status: "DELIVERED",
        paymentType: "PAID_ADVANCE",
        agreedAmount: 4500,
        currency: "INR",
        isPaid: false,
        tags: "reels,instagram,batch",
        notes: "Pending payment. 5 reels.",
        dueDate: past(2),
        completedAt: past(3),
      },
      {
        userId: seedUserId,
        title: "Weekly Reels Batch #3",
        clientId: reels.id,
        status: "IN_PROGRESS",
        paymentType: "UNPAID",
        agreedAmount: 4500,
        currency: "INR",
        isPaid: false,
        tags: "reels,instagram,batch",
        notes: "Currently editing.",
        dueDate: future(3),
        completedAt: null,
      },
      {
        userId: seedUserId,
        title: "Favor - Birthday Reel for Friend",
        clientId: reels.id,
        status: "DELIVERED",
        paymentType: "FREE",
        agreedAmount: null,
        currency: "INR",
        isPaid: false,
        tags: "free,personal",
        notes: "Done as a favor, no charge.",
        dueDate: past(8),
        completedAt: past(8),
      },
      {
        userId: seedUserId,
        title: "River of Stories - Month 1",
        clientId: vrindavan.id,
        status: "DELIVERED",
        paymentType: "SALARY",
        agreedAmount: 40000,
        currency: "INR",
        isPaid: true,
        tags: "documentary,salary,longform",
        notes: "Monthly salary for ongoing documentary project.",
        dueDate: past(30),
        completedAt: past(30),
      },
      {
        userId: seedUserId,
        title: "River of Stories - Month 2",
        clientId: vrindavan.id,
        status: "DELIVERED",
        paymentType: "SALARY",
        agreedAmount: 40000,
        currency: "INR",
        isPaid: true,
        tags: "documentary,salary,longform",
        notes: "Month 2 of the documentary series.",
        dueDate: past(1),
        completedAt: past(1),
      },
      {
        userId: seedUserId,
        title: "River of Stories - Month 3",
        clientId: vrindavan.id,
        status: "IN_PROGRESS",
        paymentType: "SALARY",
        agreedAmount: 40000,
        currency: "INR",
        isPaid: false,
        tags: "documentary,salary,longform",
        notes: "Current month. Cut in progress.",
        dueDate: future(29),
        completedAt: null,
      },
    ],
  })

  const projectCount = await prisma.project.count()
  console.log(`Seeded ${clients.length} clients and ${projectCount} projects`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
