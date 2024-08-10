#  About

Maverick House is an application that provides listing for the hospitality industry in 
Diani, Ukunda.

## Tech Stack
 - Next.js 13 App Router: React
 - Tailwind
 - Prisma 
 - MongoDB 
 - NextAuth 
 - Cloudinary

Features:

- Tailwind design
- Tailwind animations and effects
- Full responsiveness
- Credential authentication
- Google authentication
- Github authentication
- Image upload using Cloudinary CDN
- Client form validation and handling using react-hook-form
- Server error handling using react-toast
- Calendars with react-date-range
- Page loading state
- Page empty state
- Booking / Reservation system
- Guest reservation cancellation
- Owner reservation cancellation
- Creation and deletion of properties
- Pricing calculation
- Advanced search algorithm by category, date range, map location, number of guests, rooms and bathrooms
    - For example we will filter out properties that have a reservation in your desired date range to travel
- Favorites system
- Shareable URL filters
    - Lets say you select a category, location and date range, you will be able to share URL with a logged out friend in another browser and they will see the same results
- How to write POST and DELETE routes in route handlers (app/api)
- How to fetch data in server react components by directly accessing database (WITHOUT API! like Magic!)
- How to handle files like error.tsx and loading.tsx which are new Next 13 templating files to unify loading and error handling
- How to handle relations between Server and Child components!



### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/eduoke/Maverick-House-of-Travel-Web.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_SECRET=
```

### Setup Prisma

```shell
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |


## Troubleshooting MongoDB server issues

You might face the following issues with your local MongoDB server, below are 
some of the issues i encountered and how i fixed them

NB: Rememeber to run the prisma push command to seteup the schema 

    ```shell
    npm prisma db push 
    ```

1. When creating a new document in the db you may trigger the following error 

```shell
error - PrismaClientKnownRequestError:
Invalid prisma.user.create() invocation:
Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. https://pris.ly/d/mongodb-replica-set
```
This error is related to Prisma and MongoDB. This error occurs when trying to use Prisma with MongoDB in a way that requires transactions, but your MongoDB server isn't configured as a replica set. Let's break down the issue and potential solutions:

1. Error Explanation:
   Prisma is trying to perform a transaction, which is only supported in MongoDB when it's running as a replica set. Your current MongoDB setup is likely a standalone instance.

2. Why This Happens:
   Transactions in MongoDB require a replica set for data consistency and safety. Prisma uses transactions for certain operations to ensure data integrity.

3. Solutions:

   a) Convert your MongoDB to a replica set:
      This is the recommended approach for production environments.
      
      Steps:
      1. Stop your MongoDB server
      2. Reconfigure it as a single-node replica set
      3. Restart the server

      Here's a basic example of how to do this:

      ```shell
      mongod --replSet rs0
      ```

      Then, initiate the replica set:

      ```shell
      mongo
      > rs.initiate()
      ```

   b) Disable transactions in Prisma:
      If you're in a development environment and don't need transactions, you can disable them in your Prisma schema.

      Add this to your schema.prisma file:

      ```prisma
      datasource db {
        provider = "mongodb"
        url      = env("DATABASE_URL")
        relationMode = "prisma"
      }
      ```

      The `relationMode = "prisma"` tells Prisma to handle relations in the Prisma layer instead of using MongoDB transactions.

   c) Use a MongoDB Atlas cluster:
      MongoDB Atlas provides managed MongoDB instances that are already configured as replica sets.

4. Best Practice:
   For production use, it's recommended to use a replica set as it provides better data safety and allows for more advanced features like transactions.

5. Next Steps:
   1. Decide which solution fits your needs (replica set, disable transactions, or use Atlas)
   2. Implement the chosen solution
   3. Update your database connection string if necessary
   4. Retry your Prisma operation


