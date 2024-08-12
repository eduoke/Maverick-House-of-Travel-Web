import placeName from '@/app/components/Map';
import { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};


export type SafeReservation = Omit<
  Reservation, 
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};



// create a new type of placeName that references the exact loction picked by 
// the map picker
// this is a work around hack to import the map picker name from this module
// to other modules without typescript screaming type issues
// has to be fixed in the future

export type SafeLocName = typeof placeName 
  