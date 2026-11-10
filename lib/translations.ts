
export type Language = "ro" | "en";

export const translations = {
    ro: {
        nav: {
            services: "Servicii",
            projects: "Proiecte",
            about: "Despre noi",
            contact: "Contact",
            portal: "Portal clienți",
            start: "Solicită o ofertă",
        },

        hero: {
            badge: "Dezvoltare web · Scanare 3D · Printare 3D",
            title: "Idei digitale.",
            highlight: "Transformate în realitate.",
            description:
                "Creăm experiențe digitale moderne și transformăm ideile tale în produse reale, precise și funcționale.",
            primary: "Începe un proiect",
            secondary: "Descoperă serviciile",
        },

        services: {
            label: "SERVICIILE NOASTRE",
            title: "Un singur partener.",
            subtitle: "Posibilități nelimitate.",
            description:
                "De la dezvoltare web la scanare și printare 3D, oferim soluții moderne adaptate proiectului tău.",
            web: "Dezvoltare web",
            webDescription:
                "Construim site-uri moderne, rapide și profesionale, care ajută afacerea ta să se remarce.",
            scanning: "Scanare 3D",
            scanningDescription:
                "Digitalizăm obiecte fizice cu precizie ridicată pentru reproducere, modificare și inginerie inversă.",
            printing: "Printare 3D",
            printingDescription:
                "Realizăm prototipuri, componente și piese personalizate folosind tehnologii moderne de printare 3D.",
            learnMore: "Află mai multe",
        },

        projects: {
            label: "PORTOFOLIU",
            title: "Proiectele noastre",
            description:
                "Descoperă o selecție de proiecte realizate cu atenție la fiecare detaliu.",
            view: "Vezi proiectul",
            all: "Toate proiectele",
        },

        about: {
            label: "DESPRE FORMORA",
            title: "Tehnologie. Precizie. Creativitate.",
            description:
                "La FORMORA combinăm tehnologia, designul și pasiunea pentru inovație pentru a transforma ideile în soluții reale.",
        },

        contact: {
            label: "CONTACT",
            title: "Ai un proiect în minte?",
            subtitle: "Hai să-l realizăm împreună.",
            description:
                "Povestește-ne despre ideea ta, iar noi te ajutăm să găsești soluția potrivită.",
            name: "Nume",
            email: "Adresă de email",
            phone: "Telefon",
            company: "Companie",
            service: "Serviciul dorit",
            message: "Descrierea proiectului",
            submit: "Trimite solicitarea",
            success: "Solicitarea a fost trimisă cu succes!",
            error: "A apărut o eroare. Încearcă din nou.",
        },

        common: {
            loading: "Se încarcă...",
            save: "Salvează",
            cancel: "Anulează",
            back: "Înapoi",
            next: "Continuă",
            close: "Închide",
            send: "Trimite",
            required: "Câmp obligatoriu",
            viewMore: "Vezi mai mult",
            getStarted: "Începe acum",
            home: "Acasă",
            login: "Autentificare",
            logout: "Deconectare",
            dashboard: "Panou de control",
        },

        footer: {
            rights: "Toate drepturile rezervate.",
            services: "Servicii",
            company: "Companie",
            contact: "Contact",
            privacy: "Politica de confidențialitate",
            terms: "Termeni și condiții",
        },
    },

    en: {
        nav: {
            services: "Services",
            projects: "Projects",
            about: "About",
            contact: "Contact",
            portal: "Client Portal",
            start: "Start a project",
        },

        hero: {
            badge: "Web Development · 3D Scanning · 3D Printing",
            title: "Digital ideas.",
            highlight: "Made real.",
            description:
                "We create modern digital experiences and turn your ideas into precise, functional products.",
            primary: "Start a project",
            secondary: "Explore services",
        },

        services: {
            label: "OUR SERVICES",
            title: "One partner.",
            subtitle: "Endless possibilities.",
            description:
                "From web development to 3D scanning and printing, we provide modern solutions tailored to your project.",
            web: "Web Development",
            webDescription:
                "We build modern, fast and professional websites that help your business stand out.",
            scanning: "3D Scanning",
            scanningDescription:
                "We digitize physical objects with high precision for reproduction, modification and reverse engineering.",
            printing: "3D Printing",
            printingDescription:
                "We create prototypes, components and custom parts using modern 3D printing technologies.",
            learnMore: "Learn more",
        },

        projects: {
            label: "PORTFOLIO",
            title: "Our projects",
            description:
                "Discover a selection of projects created with attention to every detail.",
            view: "View project",
            all: "All projects",
        },

        about: {
            label: "ABOUT FORMORA",
            title: "Technology. Precision. Creativity.",
            description:
                "At FORMORA, we combine technology, design and a passion for innovation to turn ideas into real solutions.",
        },

        contact: {
            label: "CONTACT",
            title: "Have a project in mind?",
            subtitle: "Let's make it happen.",
            description:
                "Tell us about your idea and we'll help you find the right solution.",
            name: "Name",
            email: "Email address",
            phone: "Phone",
            company: "Company",
            service: "Requested service",
            message: "Project description",
            submit: "Send request",
            success: "Your request has been sent successfully!",
            error: "Something went wrong. Please try again.",
        },

        common: {
            loading: "Loading...",
            save: "Save",
            cancel: "Cancel",
            back: "Back",
            next: "Continue",
            close: "Close",
            send: "Send",
            required: "Required field",
            viewMore: "View more",
            getStarted: "Get started",
            home: "Home",
            login: "Log in",
            logout: "Log out",
            dashboard: "Dashboard",
        },

        footer: {
            rights: "All rights reserved.",
            services: "Services",
            company: "Company",
            contact: "Contact",
            privacy: "Privacy Policy",
            terms: "Terms and Conditions",
        },
    },
} as const;

export type Translation = typeof translations.ro;
