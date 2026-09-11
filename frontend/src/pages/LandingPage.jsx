import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
    {
        image: "/carousal-images/grey sofa.jpg",
        eyebrow: "Comfort Meets Style",
        title: "Furniture That Makes Your Space Feel Like Home",
        description:
            "Discover thoughtfully selected furniture for living rooms, bedrooms, offices and every space in between.",
        buttonText: "Shop Furniture",
        buttonLink: "/products",
    },
    {
        image: "/carousal-images/white sofa.jpg",
        eyebrow: "Modern Living",
        title: "Create a Space You’ll Love Coming Home To",
        description:
            "Bring elegance, comfort and personality into your home with furniture designed for modern living.",
        buttonText: "Explore Collection",
        buttonLink: "/products",
    },
    {
        image: "/carousal-images/leather_brown.jpg",
        eyebrow: "Timeless Design",
        title: "Classic Pieces. Lasting Impressions.",
        description:
            "From sophisticated leather pieces to everyday essentials, find furniture built around your lifestyle.",
        buttonText: "View Collection",
        buttonLink: "/products",
    },
    {
        image: "/carousal-images/workstation table.jpg",
        eyebrow: "Work Better",
        title: "Build a Workspace That Inspires You",
        description:
            "Upgrade your home or office with practical desks, comfortable chairs and workspace essentials.",
        buttonText: "Shop Office Furniture",
        buttonLink: "/products?category=Office",
    },
    {
        image: "/carousal-images/white_chair_along_table.jpg",
        eyebrow: "Designed For You",
        title: "Beautiful Furniture For Every Corner",
        description:
            "Find the right combination of style and functionality for your home, office and outdoor spaces.",
        buttonText: "Start Shopping",
        buttonLink: "/products",
    },
];

export const LandingPage = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = () => {
        setCurrentSlide((current) =>
            current === slides.length - 1 ? 0 : current + 1
        );
    };

    const previousSlide = () => {
        setCurrentSlide((current) =>
            current === 0 ? slides.length - 1 : current - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        if (isPaused) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentSlide((current) =>
                current === slides.length - 1 ? 0 : current + 1
            );
        }, 6000);

        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowRight") {
                nextSlide();
            }

            if (event.key === "ArrowLeft") {
                previousSlide();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const slide = slides[currentSlide];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Carousel */}
            <section
                className="relative overflow-hidden bg-gray-900"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                aria-label="Furniture highlights"
            >
                {/* Slides */}
                <div className="relative h-[620px] sm:h-[650px] lg:h-[700px]">
                    {slides.map((item, index) => (
                        <div
                            key={item.image}
                            className={`absolute inset-0 transition-opacity duration-700 ${
                                index === currentSlide
                                    ? "z-10 opacity-100"
                                    : "pointer-events-none z-0 opacity-0"
                            }`}
                            aria-hidden={index !== currentSlide}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover"
                            />

                            {/* Image overlays */}
                            <div className="absolute inset-0 bg-black/35" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                    ))}

                    {/* Hero content */}
                    <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8 lg:px-10">
                        <div className="max-w-2xl text-white">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="h-px w-10 bg-blue-400 sm:w-14" />

                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 sm:text-sm">
                                    {slide.eyebrow}
                                </span>
                            </div>

                            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
                                {slide.title}
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-gray-200 sm:mt-6 sm:text-base sm:leading-7 lg:text-lg">
                                {slide.description}
                            </p>

                            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => navigate(slide.buttonLink)}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    {slide.buttonText}

                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/products")}
                                    className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                                >
                                    Browse All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Previous button */}
                    <button
                        type="button"
                        onClick={previousSlide}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40 sm:left-5 sm:h-12 sm:w-12"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    {/* Next button */}
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40 sm:right-5 sm:h-12 sm:w-12"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    {/* Bottom carousel controls */}
                    <div className="absolute bottom-7 left-0 right-0 z-30">
                        <div className="mx-auto flex max-w-7xl items-end justify-between px-5 sm:px-8 lg:px-10">
                            {/* Dots */}
                            <div className="flex items-center gap-2">
                                {slides.map((item, index) => (
                                    <button
                                        key={item.image}
                                        type="button"
                                        onClick={() => goToSlide(index)}
                                        aria-label={`Go to slide ${
                                            index + 1
                                        }`}
                                        aria-current={
                                            index === currentSlide
                                        }
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            index === currentSlide
                                                ? "w-9 bg-white"
                                                : "w-2 bg-white/50 hover:bg-white/80"
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Slide counter */}
                            <div className="rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                                {String(currentSlide + 1).padStart(2, "0")}
                                <span className="mx-1 text-white/40">
                                    /
                                </span>
                                {String(slides.length).padStart(2, "0")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value propositions */}
            <section className="border-b border-gray-100 bg-white">
                <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-100 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
                    <div className="flex items-center gap-4 py-6 sm:px-6 lg:py-8 lg:first:pl-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m-8-14l8 4m-8-4v10l8 4m0-10v10"
                                />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Quality Furniture
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Carefully selected pieces
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-6 sm:px-6 lg:py-8">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Built For Everyday Life
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Comfort and functionality
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-6 sm:px-6 lg:py-8 lg:last:pr-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m3-5h4a2 2 0 012 2v3H8V5a2 2 0 012-2z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Furniture For Every Space
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Home, office and outdoor
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro section */}
            <section className="bg-gray-50 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                                Find Your Style
                            </span>

                            <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                                Furniture that fits your life.
                            </h2>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                                Whether you're furnishing a new home,
                                refreshing your living room or creating a
                                productive workspace, our collection makes it
                                easier to find pieces that look great and work
                                beautifully.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800"
                            >
                                Explore the collection

                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-5">
                            <div className="overflow-hidden rounded-2xl">
                                <img
                                    src="/carousal-images/netlike_white.jpg"
                                    alt="Furniture detail"
                                    className="h-52 w-full object-cover transition duration-500 hover:scale-105 sm:h-72"
                                    loading="lazy"
                                />
                            </div>

                            <div className="mt-8 overflow-hidden rounded-2xl sm:mt-12">
                                <img
                                    src="/carousal-images/workstation chair.jpg"
                                    alt="Workstation chair"
                                    className="h-52 w-full object-cover transition duration-500 hover:scale-105 sm:h-72"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-blue-600 px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
                    <div>
                        <h2 className="text-2xl font-black text-white sm:text-3xl">
                            Ready to transform your space?
                        </h2>

                        <p className="mt-2 text-sm text-blue-100 sm:text-base">
                            Browse our furniture collection and find your next
                            favourite piece.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="shrink-0 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50"
                    >
                        Shop Now
                    </button>
                </div>
            </section>
        </main>
    );
};
