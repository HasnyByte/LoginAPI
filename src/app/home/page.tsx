'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navigation */}
            <nav className="w-full border-b border-gray-200">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                        Livere
                    </Link>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex items-center gap-2 text-blue-700 hover:bg-blue-100" asChild>
                            <Link href="/auth/login">
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 border-blue-700 text-blue-700 hover:bg-blue-100" asChild>
                            <Link href="/auth/register">
                                <UserPlus className="h-4 w-4" />
                                Register
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                        Take Control of
                        <br />
                        Your Tasks
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        Livere simplifies task management with a sleek, secure interface. Stay organized, receive real-time updates, and enjoy a beautifully designed experience that keeps you on top of your to-do list.
                    </p>
                    <Button size="lg" className="bg-blue-700 text-white mt-8 hover:bg-blue-800 transition" asChild>
                        <Link href="/auth/register">Get Started</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default Home;
