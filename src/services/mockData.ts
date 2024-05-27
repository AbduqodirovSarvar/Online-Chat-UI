import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

export interface Userr {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  photoName?: string;
  sentMessages: Messagee[];
  receivedMessages: Messagee[];
}

export interface Messagee {
  id: string;
  senderId: string;
  receiverId: string;
  msg: string;
  isSeen: boolean;
  seenAt: Date;
}

export enum UserRole {
  User = 'User',
  Admin = 'Admin'
}


export const mockUsers: Userr[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    passwordHash: 'hashedPassword1',
    role: UserRole.User,
    photoName: 'photo1.jpg',
    sentMessages: [
      { id: '1', senderId: '1', receiverId: '2', msg: 'Hello, User2!', isSeen: true, seenAt: new Date() },
      { id: '2', senderId: '1', receiverId: '3', msg: 'Hi, User3!', isSeen: false, seenAt: new Date() },
      { id: '3', senderId: '1', receiverId: '4', msg: 'Good morning, User4!', isSeen: true, seenAt: new Date() },
      { id: '4', senderId: '1', receiverId: '5', msg: 'How are you, User5?', isSeen: true, seenAt: new Date() },
      { id: '5', senderId: '1', receiverId: '6', msg: 'What\'s up, User6?', isSeen: false, seenAt: new Date() },
      { id: '6', senderId: '1', receiverId: '7', msg: 'Hey, User7!', isSeen: true, seenAt: new Date() },
      { id: '7', senderId: '1', receiverId: '8', msg: 'Greetings, User8!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '8', senderId: '2', receiverId: '1', msg: 'Hi John!', isSeen: true, seenAt: new Date() },
      { id: '9', senderId: '3', receiverId: '1', msg: 'Good morning John!', isSeen: false, seenAt: new Date() },
      { id: '10', senderId: '4', receiverId: '1', msg: 'Hello John!', isSeen: true, seenAt: new Date() },
      { id: '11', senderId: '5', receiverId: '1', msg: 'Hey John!', isSeen: true, seenAt: new Date() },
      { id: '12', senderId: '6', receiverId: '1', msg: 'Hi there John!', isSeen: false, seenAt: new Date() },
      { id: '13', senderId: '7', receiverId: '1', msg: 'What\'s up John!', isSeen: true, seenAt: new Date() },
      { id: '14', senderId: '8', receiverId: '1', msg: 'Hey there John!', isSeen: true, seenAt: new Date() }
    ]
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    passwordHash: 'hashedPassword2',
    role: UserRole.User,
    photoName: 'photo2.jpg',
    sentMessages: [
      { id: '15', senderId: '2', receiverId: '1', msg: 'Hello, John!', isSeen: true, seenAt: new Date() },
      { id: '16', senderId: '2', receiverId: '3', msg: 'Hi, User3!', isSeen: false, seenAt: new Date() },
      { id: '17', senderId: '2', receiverId: '4', msg: 'Good morning, User4!', isSeen: true, seenAt: new Date() },
      { id: '18', senderId: '2', receiverId: '5', msg: 'How are you, User5?', isSeen: true, seenAt: new Date() },
      { id: '19', senderId: '2', receiverId: '6', msg: 'What\'s up, User6?', isSeen: false, seenAt: new Date() },
      { id: '20', senderId: '2', receiverId: '7', msg: 'Hey, User7!', isSeen: true, seenAt: new Date() },
      { id: '21', senderId: '2', receiverId: '8', msg: 'Greetings, User8!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '22', senderId: '1', receiverId: '2', msg: 'Hi Jane!', isSeen: true, seenAt: new Date() },
      { id: '23', senderId: '3', receiverId: '2', msg: 'Good morning Jane!', isSeen: false, seenAt: new Date() },
      { id: '24', senderId: '4', receiverId: '2', msg: 'Hello Jane!', isSeen: true, seenAt: new Date() },
      { id: '25', senderId: '5', receiverId: '2', msg: 'Hey Jane!', isSeen: true, seenAt: new Date() },
      { id: '26', senderId: '6', receiverId: '2', msg: 'Hi there Jane!', isSeen: false, seenAt: new Date() },
      { id: '27', senderId: '7', receiverId: '2', msg: 'What\'s up Jane!', isSeen: true, seenAt: new Date() },
      { id: '28', senderId: '8', receiverId: '2', msg: 'Hey there Jane!', isSeen: true, seenAt: new Date() }
    ]
  },
  // Add 8 more users in the same way
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    passwordHash: 'hashedPassword3',
    role: UserRole.User,
    photoName: 'photo3.jpg',
    sentMessages: [
      { id: '29', senderId: '3', receiverId: '1', msg: 'Hello, John!', isSeen: true, seenAt: new Date() },
      { id: '30', senderId: '3', receiverId: '2', msg: 'Hi, Jane!', isSeen: false, seenAt: new Date() },
      { id: '31', senderId: '3', receiverId: '4', msg: 'Good morning, User4!', isSeen: true, seenAt: new Date() },
      { id: '32', senderId: '3', receiverId: '5', msg: 'How are you, User5?', isSeen: true, seenAt: new Date() },
      { id: '33', senderId: '3', receiverId: '6', msg: 'What\'s up, User6?', isSeen: false, seenAt: new Date() },
      { id: '34', senderId: '3', receiverId: '7', msg: 'Hey, User7!', isSeen: true, seenAt: new Date() },
      { id: '35', senderId: '3', receiverId: '8', msg: 'Greetings, User8!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '36', senderId: '1', receiverId: '3', msg: 'Hi Alice!', isSeen: true, seenAt: new Date() },
      { id: '37', senderId: '2', receiverId: '3', msg: 'Good morning Alice!', isSeen: false, seenAt: new Date() },
      { id: '38', senderId: '4', receiverId: '3', msg: 'Hello Alice!', isSeen: true, seenAt: new Date() },
      { id: '39', senderId: '5', receiverId: '3', msg: 'Hey Alice!', isSeen: true, seenAt: new Date() },
      { id: '40', senderId: '6', receiverId: '3', msg: 'Hi there Alice!', isSeen: false, seenAt: new Date() },
      { id: '41', senderId: '7', receiverId: '3', msg: 'What\'s up Alice!', isSeen: true, seenAt: new Date() },
      { id: '42', senderId: '8', receiverId: '3', msg: 'Hey there Alice!', isSeen: true, seenAt: new Date() }
    ]
  },
  {
    id: '4',
    firstName: 'Bob',
    lastName: 'Williams',
    email: 'bob.williams@example.com',
    passwordHash: 'hashedPassword4',
    role: UserRole.User,
    photoName: 'photo4.jpg',
    sentMessages: [
      { id: '43', senderId: '4', receiverId: '1', msg: 'Hello, John!', isSeen: true, seenAt: new Date() },
      { id: '44', senderId: '4', receiverId: '2', msg: 'Hi, Jane!', isSeen: false, seenAt: new Date() },
      { id: '45', senderId: '4', receiverId: '3', msg: 'Good morning, Alice!', isSeen: true, seenAt: new Date() },
      { id: '46', senderId: '4', receiverId: '5', msg: 'How are you, User5?', isSeen: true, seenAt: new Date() },
      { id: '47', senderId: '4', receiverId: '6', msg: 'What\'s up, User6?', isSeen: false, seenAt: new Date() },
      { id: '48', senderId: '4', receiverId: '7', msg: 'Hey, User7!', isSeen: true, seenAt: new Date() },
      { id: '49', senderId: '4', receiverId: '8', msg: 'Greetings, User8!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '50', senderId: '1', receiverId: '4', msg: 'Hi Bob!', isSeen: true, seenAt: new Date() },
      { id: '51', senderId: '2', receiverId: '4', msg: 'Good morning Bob!', isSeen: false, seenAt: new Date() },
      { id: '52', senderId: '3', receiverId: '4', msg: 'Hello Bob!', isSeen: true, seenAt: new Date() },
      { id: '53', senderId: '5', receiverId: '4', msg: 'Hey Bob!', isSeen: true, seenAt: new Date() },
      { id: '54', senderId: '6', receiverId: '4', msg: 'Hi there Bob!', isSeen: false, seenAt: new Date() },
      { id: '55', senderId: '7', receiverId: '4', msg: 'What\'s up Bob!', isSeen: true, seenAt: new Date() },
      { id: '56', senderId: '8', receiverId: '4', msg: 'Hey there Bob!', isSeen: true, seenAt: new Date() }
    ]
  },
  {
    id: '5',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    passwordHash: 'hashedPassword5',
    role: UserRole.User,
    photoName: 'photo5.jpg',
    sentMessages: [
      { id: '57', senderId: '5', receiverId: '1', msg: 'Hello, John!', isSeen: true, seenAt: new Date() },
      { id: '58', senderId: '5', receiverId: '2', msg: 'Hi, Jane!', isSeen: false, seenAt: new Date() },
      { id: '59', senderId: '5', receiverId: '3', msg: 'Good morning, Alice!', isSeen: true, seenAt: new Date() },
      { id: '60', senderId: '5', receiverId: '4', msg: 'How are you, Bob?', isSeen: true, seenAt: new Date() },
      { id: '61', senderId: '5', receiverId: '6', msg: 'What\'s up, User6?', isSeen: false, seenAt: new Date() },
      { id: '62', senderId: '5', receiverId: '7', msg: 'Hey, User7!', isSeen: true, seenAt: new Date() },
      { id: '63', senderId: '5', receiverId: '8', msg: 'Greetings, User8!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '64', senderId: '1', receiverId: '5', msg: 'Hi Charlie!', isSeen: true, seenAt: new Date() },
      { id: '65', senderId: '2', receiverId: '5', msg: 'Good morning Charlie!', isSeen: false, seenAt: new Date() },
      { id: '66', senderId: '3', receiverId: '5', msg: 'Hello Charlie!', isSeen: true, seenAt: new Date() },
      { id: '67', senderId: '4', receiverId: '5', msg: 'Hey Charlie!', isSeen: true, seenAt: new Date() },
      { id: '68', senderId: '6', receiverId: '5', msg: 'Hi there Charlie!', isSeen: false, seenAt: new Date() },
      { id: '69', senderId: '7', receiverId: '5', msg: 'What\'s up Charlie!', isSeen: true, seenAt: new Date() },
      { id: '70', senderId: '8', receiverId: '5', msg: 'Hey there Charlie!', isSeen: true, seenAt: new Date() }
    ]
  },
  // Add 5 more users in the same way
  {
    id: '6',
    firstName: 'Dave',
    lastName: 'Martin',
    email: 'dave.martin@example.com',
    passwordHash: 'hashedPassword6',
    role: UserRole.User,
    photoName: 'photo6.jpg',
    sentMessages: [
      { id: '71', senderId: '6', receiverId: '1', msg: 'Hello, John!', isSeen: true, seenAt: new Date() },
      { id: '72', senderId: '6', receiverId: '2', msg: 'Hi, Jane!', isSeen: false, seenAt: new Date() },
      { id: '73', senderId: '6', receiverId: '3', msg: 'Good morning, Alice!', isSeen: true, seenAt: new Date() },
      { id: '74', senderId: '6', receiverId: '4', msg: 'How are you, Bob?', isSeen: true, seenAt: new Date() },
      { id: '75', senderId: '6', receiverId: '5', msg: 'What\'s up, Charlie?', isSeen: false, seenAt: new Date() },
      { id: '76', senderId: '6', receiverId: '7', msg: 'Hey, User7!', isSeen: true, seenAt: new Date() },
      { id: '77', senderId: '6', receiverId: '8', msg: 'Greetings, User8!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '78', senderId: '1', receiverId: '6', msg: 'Hi Dave!', isSeen: true, seenAt: new Date() },
      { id: '79', senderId: '2', receiverId: '6', msg: 'Good morning Dave!', isSeen: false, seenAt: new Date() },
      { id: '80', senderId: '3', receiverId: '6', msg: 'Hello Dave!', isSeen: true, seenAt: new Date() },
      { id: '81', senderId: '4', receiverId: '6', msg: 'Hey Dave!', isSeen: true, seenAt: new Date() },
      { id: '82', senderId: '5', receiverId: '6', msg: 'Hi there Dave!', isSeen: false, seenAt: new Date() },
      { id: '83', senderId: '7', receiverId: '6', msg: 'What\'s up Dave!', isSeen: true, seenAt: new Date() },
      { id: '84', senderId: '8', receiverId: '6', msg: 'Hey there Dave!', isSeen: true, seenAt: new Date() }
    ]
  },
  {
    id: '7',
    firstName: 'Eve',
    lastName: 'Miller',
    email: 'eve.miller@example.com',
    passwordHash: 'hashedPassword7',
    role: UserRole.User,
    photoName: 'photo7.jpg',
    sentMessages: [
      { id: '85', senderId: '7', receiverId: '1', msg: 'Hello, John!', isSeen: true, seenAt: new Date() },
      { id: '86', senderId: '7', receiverId: '2', msg: 'Hi, Jane!', isSeen: false, seenAt: new Date() },
      { id: '87', senderId: '7', receiverId: '3', msg: 'Good morning, Alice!', isSeen: true, seenAt: new Date() },
      { id: '88', senderId: '7', receiverId: '4', msg: 'How are you, Bob?', isSeen: true, seenAt: new Date() },
      { id: '89', senderId: '7', receiverId: '5', msg: 'What\'s up, Charlie?', isSeen: false, seenAt: new Date() },
      { id: '90', senderId: '7', receiverId: '6', msg: 'Hey, Dave!', isSeen: true, seenAt: new Date() },
      { id: '91', senderId: '7', receiverId: '8', msg: 'Greetings, User8!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '92', senderId: '1', receiverId: '7', msg: 'Hi Eve!', isSeen: true, seenAt: new Date() },
      { id: '93', senderId: '2', receiverId: '7', msg: 'Good morning Eve!', isSeen: false, seenAt: new Date() },
      { id: '94', senderId: '3', receiverId: '7', msg: 'Hello Eve!', isSeen: true, seenAt: new Date() },
      { id: '95', senderId: '4', receiverId: '7', msg: 'Hey Eve!', isSeen: true, seenAt: new Date() },
      { id: '96', senderId: '5', receiverId: '7', msg: 'Hi there Eve!', isSeen: false, seenAt: new Date() },
      { id: '97', senderId: '6', receiverId: '7', msg: 'What\'s up Eve!', isSeen: true, seenAt: new Date() },
      { id: '98', senderId: '8', receiverId: '7', msg: 'Hey there Eve!', isSeen: true, seenAt: new Date() }
    ]
  },
  {
    id: '8',
    firstName: 'Frank',
    lastName: 'Wilson',
    email: 'frank.wilson@example.com',
    passwordHash: 'hashedPassword8',
    role: UserRole.User,
    photoName: 'photo8.jpg',
    sentMessages: [
      { id: '99', senderId: '8', receiverId: '1', msg: 'Hello, John!', isSeen: true, seenAt: new Date() },
      { id: '100', senderId: '8', receiverId: '2', msg: 'Hi, Jane!', isSeen: false, seenAt: new Date() },
      { id: '101', senderId: '8', receiverId: '3', msg: 'Good morning, Alice!', isSeen: true, seenAt: new Date() },
      { id: '102', senderId: '8', receiverId: '4', msg: 'How are you, Bob?', isSeen: true, seenAt: new Date() },
      { id: '103', senderId: '8', receiverId: '5', msg: 'What\'s up, Charlie?', isSeen: false, seenAt: new Date() },
      { id: '104', senderId: '8', receiverId: '6', msg: 'Hey, Dave!', isSeen: true, seenAt: new Date() },
      { id: '105', senderId: '8', receiverId: '7', msg: 'Greetings, Eve!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '106', senderId: '1', receiverId: '8', msg: 'Hi Frank!', isSeen: true, seenAt: new Date() },
      { id: '107', senderId: '2', receiverId: '8', msg: 'Good morning Frank!', isSeen: false, seenAt: new Date() },
      { id: '108', senderId: '3', receiverId: '8', msg: 'Hello Frank!', isSeen: true, seenAt: new Date() },
      { id: '109', senderId: '4', receiverId: '8', msg: 'Hey Frank!', isSeen: true, seenAt: new Date() },
      { id: '110', senderId: '5', receiverId: '8', msg: 'Hi there Frank!', isSeen: false, seenAt: new Date() },
      { id: '111', senderId: '6', receiverId: '8', msg: 'What\'s up Frank!', isSeen: true, seenAt: new Date() },
      { id: '112', senderId: '7', receiverId: '8', msg: 'Hey there Frank!', isSeen: true, seenAt: new Date() }
    ]
  },
  {
    id: '9',
    firstName: 'Grace',
    lastName: 'Davis',
    email: 'grace.davis@example.com',
    passwordHash: 'hashedPassword9',
    role: UserRole.User,
    photoName: 'photo9.jpg',
    sentMessages: [
      { id: '113', senderId: '9', receiverId: '1', msg: 'Hello, John!', isSeen: true, seenAt: new Date() },
      { id: '114', senderId: '9', receiverId: '2', msg: 'Hi, Jane!', isSeen: false, seenAt: new Date() },
      { id: '115', senderId: '9', receiverId: '3', msg: 'Good morning, Alice!', isSeen: true, seenAt: new Date() },
      { id: '116', senderId: '9', receiverId: '4', msg: 'How are you, Bob?', isSeen: true, seenAt: new Date() },
      { id: '117', senderId: '9', receiverId: '5', msg: 'What\'s up, Charlie?', isSeen: false, seenAt: new Date() },
      { id: '118', senderId: '9', receiverId: '6', msg: 'Hey, Dave!', isSeen: true, seenAt: new Date() },
      { id: '119', senderId: '9', receiverId: '7', msg: 'Greetings, Eve!', isSeen: true, seenAt: new Date() }
    ],
    receivedMessages: [
      { id: '120', senderId: '1', receiverId: '9', msg: 'Hi Grace!', isSeen: true, seenAt: new Date() },
      { id: '121', senderId: '2', receiverId: '9', msg: 'Good morning Grace!', isSeen: false, seenAt: new Date() },
      { id: '122', senderId: '3', receiverId: '9', msg: 'Hello Grace!', isSeen: true, seenAt: new Date() },
      { id: '123', senderId: '4', receiverId: '9', msg: 'Hey Grace!', isSeen: true, seenAt: new Date() },
      { id: '124', senderId: '5', receiverId: '9', msg: 'Hi there Grace!', isSeen: false, seenAt: new Date() },
      { id: '125', senderId: '6', receiverId: '9', msg: 'What\'s up Grace!', isSeen: true, seenAt: new Date() },
      { id: '126', senderId: '7', receiverId: '9', msg: 'Hey there Grace!', isSeen: true, seenAt: new Date() }
    ]
  }
];
