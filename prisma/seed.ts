import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  // Create Admin Users
  const hashedPassword = await bcrypt.hash('Admin123!', 10)
  
  const superAdmin = await db.admin.upsert({
    where: { email: 'admin@hightech-eljadida.ma' },
    update: {},
    create: {
      email: 'admin@hightech-eljadida.ma',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      password: hashedPassword
    }
  })

  const secretary = await db.admin.upsert({
    where: { email: 'secretaire@hightech-eljadida.ma' },
    update: {},
    create: {
      email: 'secretaire@hightech-eljadida.ma',
      name: 'Marie Dupont',
      role: 'SECRETARY',
      password: await bcrypt.hash('Secret123!', 10)
    }
  })

  const teacher = await db.admin.upsert({
    where: { email: 'formateur@hightech-eljadida.ma' },
    update: {},
    create: {
      email: 'formateur@hightech-eljadida.ma',
      name: 'Ahmed Benali',
      role: 'TEACHER',
      password: await bcrypt.hash('Formateur123!', 10)
    }
  })

  console.log('=== Utilisateurs créés ===')
  console.log('Super Admin: admin@hightech-eljadida.ma / Admin123!')
  console.log('Secrétaire: secretaire@hightech-eljadida.ma / Secret123!')
  console.log('Formateur: formateur@hightech-eljadida.ma / Formateur123!')
  console.log('==========================')

  // Create Languages
  const english = await db.language.upsert({
    where: { code: 'EN' },
    update: {},
    create: { name: 'Anglais', code: 'EN', icon: '🇬🇧' }
  })

  const spanish = await db.language.upsert({
    where: { code: 'ES' },
    update: {},
    create: { name: 'Espagnol', code: 'ES', icon: '🇪🇸' }
  })

  const german = await db.language.upsert({
    where: { code: 'DE' },
    update: {},
    create: { name: 'Allemand', code: 'DE', icon: '🇩🇪' }
  })

  const french = await db.language.upsert({
    where: { code: 'FR' },
    update: {},
    create: { name: 'Français', code: 'FR', icon: '🇫🇷' }
  })

  const italian = await db.language.upsert({
    where: { code: 'IT' },
    update: {},
    create: { name: 'Italien', code: 'IT', icon: '🇮🇹' }
  })

  const chinese = await db.language.upsert({
    where: { code: 'ZH' },
    update: {},
    create: { name: 'Chinois', code: 'ZH', icon: '🇨🇳' }
  })

  // Create Levels
  const beginner = await db.level.upsert({
    where: { id: 'level-beginner' },
    update: {},
    create: { id: 'level-beginner', name: 'Débutant', description: 'Niveau A1-A2', order: 1 }
  })

  const intermediate = await db.level.upsert({
    where: { id: 'level-intermediate' },
    update: {},
    create: { id: 'level-intermediate', name: 'Intermédiaire', description: 'Niveau B1-B2', order: 2 }
  })

  const advanced = await db.level.upsert({
    where: { id: 'level-advanced' },
    update: {},
    create: { id: 'level-advanced', name: 'Avancé', description: 'Niveau C1-C2', order: 3 }
  })

  // Create Rooms
  await db.room.upsert({
    where: { id: 'room-a1' },
    update: {},
    create: { id: 'room-a1', name: 'Salle A1', capacity: 15, building: 'Bâtiment Principal' }
  })

  await db.room.upsert({
    where: { id: 'room-a2' },
    update: {},
    create: { id: 'room-a2', name: 'Salle A2', capacity: 20, building: 'Bâtiment Principal' }
  })

  await db.room.upsert({
    where: { id: 'room-b1' },
    update: {},
    create: { id: 'room-b1', name: 'Salle B1', capacity: 12, building: 'Bâtiment Annexe' }
  })

  await db.room.upsert({
    where: { id: 'room-lab' },
    update: {},
    create: { id: 'room-lab', name: 'Labo Multimédia', capacity: 25, building: 'Bâtiment Principal' }
  })

  // Create Sample Courses
  const course1 = await db.course.upsert({
    where: { code: 'ANG-DEB' },
    update: {},
    create: {
      code: 'ANG-DEB',
      name: 'Anglais Débutant',
      description: 'Cours d\'anglais pour débutants - Niveau A1',
      duration: 60,
      price: 350,
      languageId: english.id
    }
  })

  const course2 = await db.course.upsert({
    where: { code: 'ANG-INT' },
    update: {},
    create: {
      code: 'ANG-INT',
      name: 'Anglais Intermédiaire',
      description: 'Cours d\'anglais intermédiaire - Niveau B1',
      duration: 80,
      price: 400,
      languageId: english.id
    }
  })

  const course3 = await db.course.upsert({
    where: { code: 'ESP-DEB' },
    update: {},
    create: {
      code: 'ESP-DEB',
      name: 'Espagnol Débutant',
      description: 'Cours d\'espagnol pour débutants',
      duration: 60,
      price: 320,
      languageId: spanish.id
    }
  })

  const course4 = await db.course.upsert({
    where: { code: 'ALL-INT' },
    update: {},
    create: {
      code: 'ALL-INT',
      name: 'Allemand Intermédiaire',
      description: 'Cours d\'allemand niveau intermédiaire',
      duration: 70,
      price: 380,
      languageId: german.id
    }
  })

  console.log('Seed data created successfully!')
  console.log('Languages:', { english, spanish, german, french, italian, chinese })
  console.log('Levels:', { beginner, intermediate, advanced })
  console.log('Courses:', { course1, course2, course3, course4 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
