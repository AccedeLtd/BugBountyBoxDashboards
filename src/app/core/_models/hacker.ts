export interface Hacker {
    id: number;
    email: string;
    fullName: string;
    userName: string;
    country: string;
    userId: string;
    image: string;
    phoneNumber: string;
    level: string;
    isActive: boolean;
    proficiencyLevels: ProficiencyLevel[];
    activationNotes: AccountActivation[];
    followers: Follower[];
    followings: Following[];
    ratings: HackerRating;
}

export interface ProficiencyLevel {
    id: number;
    type: string;
    level: string;
}

export interface AccountActivation {
    title: string;
    userId: string;
    reason: string;
    adminUserId: string;
    adminName: string;
    date: string;
}

export interface Follower {
    userId: string;
    email: string;
    fullName: string;
    userName: string;
    country: string;

}

export interface Following {
    userId: string;
    email: string;
    fullName: string;
    userName: string;
    country: string;
}

export interface HackerRating {
    level: number;
    stats: RatingStat[]
}

export interface RatingStat {
    testingType: string;
    rating: number;
}