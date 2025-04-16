"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const digitHeight = document.querySelector(".num")?.clientHeight || 100;
        const tl = gsap.timeline();

        // Loader animations
        tl.from(".loader-1", {
            width: 0,
            duration: 6,
            ease: "power2.inOut"
        }, 0);

        tl.from(".loader-2", {
            width: 0,
            duration: 6,
            ease: "power2.inOut"
        }, 1.9);

        const digits = document.querySelectorAll(".digit");

        if (digits.length >= 3) {
            tl.to(digits[2], {
                y: -10 * digitHeight,
                duration: 3,
                ease: "power2.inOut"
            }, 1);

            tl.to(digits[1], {
                y: -10 * digitHeight,
                duration: 1.5,
                ease: "power2.inOut"
            }, 3.5);

            tl.to(digits[0], {
                y: -1 * digitHeight,
                duration: 1,
                ease: "power2.inOut"
            }, 4.5);
        }

        tl.to(".loader", {
            background: "none",
            duration: 0.1
        }, 6);

        tl.to(".loader-1", {
            rotate: 90,
            y: -50,
            duration: 0.5
        }, 6);

        tl.to(".loader-2", {
            x: -75,
            y: 75,
            duration: 0.5
        }, 6);

        tl.to(".digit", {
            top: "-150px",
            stagger: {
                amount: 0.25,
            },
            duration: 1,
            ease: "power4.inOut"
        }, 6);

        tl.to(".loader", {
            scale: 40,
            duration: 1,
            ease: "power2.inOut"
        }, 7);

        tl.to(".loader", {
            rotate: 45,
            y: 500,
            x: 2000,
            duration: 1,
            ease: "power2.inOut"
        }, 7);

        tl.to(".loading-screen", {
            opacity: 0,
            duration: 0.5,
            ease: "power1.inOut",
            onComplete: () => {
                router.push("/home"); // ✅ langsung redirect saat animasi selesai
            }
        }, 7.5);

        // Tidak perlu munculkan .website-content karena tidak ditampilkan

    }, []);

    return (
        <>
            {/* Preloader only */}
            <div className="loading-screen fixed top-0 left-0 w-full h-full bg-blue-500 text-white pointer-events-none z-50">
                <div className="loader absolute top-[50%] left-[50%] w-[300px] h-[50px] flex transform -translate-x-1/2 -translate-y-1/2 bg-gray-400">
                    <div className="loader-1 relative bg-white w-[200px]">
                        <div className="bar h-[50px]"></div>
                    </div>

                    <div className="loader-2 relative bg-white w-[100px]">
                        <div className="bar h-[50px]"></div>
                    </div>
                </div>

                <div className="fixed left-[50px] bottom-[50px] flex h-[100px] text-[100px] leading-[102px] font-normal" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100px, 0 100px)" }}>
                    <div className="relative top-[-15px]">
                        <div className="digit">
                            <div className="num">0</div>
                            <div className="num num1offset1 relative right-[-15px] ">1</div>
                        </div>
                    </div>
                    <div className="relative top-[-15px]">
                        <div className="digit">
                            <div className="num">0</div>
                            <div className="num num1offset2 relative right-[-10px]">1</div>
                            <div className="num">2</div>
                            <div className="num">3</div>
                            <div className="num">4</div>
                            <div className="num">5</div>
                            <div className="num">6</div>
                            <div className="num">7</div>
                            <div className="num">8</div>
                            <div className="num">9</div>
                            <div className="num">0</div>
                        </div>
                    </div>
                    <div className="counter-3 relative top-[-15px]">
                        <div className="digit">
                            <div className="num">0</div>
                            <div className="num">1</div>
                            <div className="num">2</div>
                            <div className="num">3</div>
                            <div className="num">4</div>
                            <div className="num">5</div>
                            <div className="num">6</div>
                            <div className="num">7</div>
                            <div className="num">8</div>
                            <div className="num">9</div>
                            <div className="num">0</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
