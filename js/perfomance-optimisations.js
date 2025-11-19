/* Performance Optimization Styles */
.performance-optimized {
    /* Optimize for performance */
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px; /* Fixed: add 'px' unit */
}

/* Image loading states */
img[data-src] {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

img.image-loaded {
    opacity: 1;
}

/* Reduce motion for performance */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Content-visibility for large sections */
.content-section {
    content-visibility: auto;
    contain-intrinsic-size: 500px 0; /* Fixed: width first, then height */
}

/* Optimize scrolling */
.optimized-scroll {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Loading states */
.loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}