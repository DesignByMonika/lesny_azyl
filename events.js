/**
 * events.js — dane wydarzeń kalendarza Leśny Azyl
 * Warsztaty co weekend (sobota + niedziela), cały rok 2026
 * Aby dodać/zmienić termin — edytuj tylko ten plik.
 */

const WORKSHOP_TYPES = [
    {
        id: 'drum',
        name: 'Steel Tongue Drum: Rytm Ciszy',
        description: 'Wprowadzenie do gry na Steel Tongue Drum. Medytacyjne dźwięki, uważność, relaks.',
        spots: 8
    },
    {
        id: 'snycerstwo',
        name: 'Snycerstwo: Łyżka i Podstawki',
        description: 'Tradycyjne rzeźbienie drewnianych łyżek nożem i dłutem. Zabierzesz własnoręcznie wykonaną łyżkę.',
        spots: 6
    },
    {
        id: 'zioła',
        name: 'Ziołolecznictwo i Ogień',
        description: 'Rozpoznawanie i zbieranie ziół, suszenie, parzenie. Wieczór przy ognisku z biesiadowaniem.',
        spots: 10
    },
    {
        id: 'las',
        name: 'Las i Uważność',
        description: 'Prowadzony spacer uważności, ćwiczenia oddechowe w lesie, medytacja przy potoku.',
        spots: 12
    }
];

// Generuj terminy na cały rok 2026 — co weekend (sob + nd)
function generateYearEvents() {
    const events = {};
    const year = 2026;

    // Ręcznie zdefiniowane wyjątki (przerwy, wydarzenia prywatne)
    const exceptions = [
        '2026-01-01', // Nowy Rok
        '2026-04-05', '2026-04-06', // Wielkanoc
        '2026-08-15', // Wniebowzięcie
        '2026-12-25', '2026-12-26', // Boże Narodzenie
        '2026-07-11', '2026-07-12', // urlop właścicieli
        '2026-07-18', '2026-07-19', // urlop właścicieli
    ];

    // Przypisz typy warsztatów rotacyjnie do sobót
    const saturdayWorkshops = ['drum', 'snycerstwo', 'zioła', 'las'];
    let satIndex = 0;

    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dow = date.getDay(); // 0=nd, 6=sob
            const key = formatDate(date);

            if (exceptions.includes(key)) {
                events[key] = { type: 'unavailable', description: 'Termin niedostępny' };
                continue;
            }

            if (dow === 6) { // sobota
                const wt = WORKSHOP_TYPES.find(w => w.id === saturdayWorkshops[satIndex % 4]);
                satIndex++;
                events[key] = {
                    type: 'workshop',
                    name: wt.name,
                    description: wt.description,
                    stay: true,
                    spotsTotal: wt.spots,
                    // Przykładowe dane zajętości — w produkcji z backendu
                    spotsTaken: Math.floor(Math.random() * (wt.spots - 1))
                };
            } else if (dow === 0) { // niedziela — kontynuacja lub inny typ
                const prevSat = new Date(date);
                prevSat.setDate(date.getDate() - 1);
                const prevKey = formatDate(prevSat);
                const prevEvent = events[prevKey];

                // Niedziela = inny typ niż sobota tego weekendu
                const sundayId = saturdayWorkshops[(satIndex + 1) % 4];
                const wt = WORKSHOP_TYPES.find(w => w.id === sundayId);
                events[key] = {
                    type: 'workshop',
                    name: wt.name,
                    description: wt.description,
                    stay: false,
                    spotsTotal: wt.spots,
                    spotsTaken: Math.floor(Math.random() * (wt.spots - 1))
                };
            }
        }
    }

    // Nadpisz dane z poprzednich miesięcy (grudzień 2025, styczeń 2026)
    Object.assign(events, {
        '2025-12-05': { type: 'unavailable', description: 'Konserwacja obiektu' },
        '2025-12-06': {
            type: 'workshop', name: 'Sobota: Rytm Ciszy (Handpan)',
            stay: true, description: 'Intensywny warsztat grania na Handpanie.',
            spotsTotal: 8, spotsTaken: 5
        },
        '2025-12-07': {
            type: 'workshop', name: 'Niedziela: Snycerstwo',
            stay: false, description: 'Tworzenie drewnianych łyżek i misek.',
            spotsTotal: 6, spotsTaken: 6
        },
        '2025-12-12': { type: 'unavailable', description: 'Urlop właścicieli' },
        '2025-12-17': {
            type: 'workshop', name: 'Środa: Ziołolecznictwo i Ogień',
            stay: false, description: 'Rozpoznawanie ziół i biesiadowanie przy ognisku.',
            spotsTotal: 10, spotsTaken: 3
        },
    });

    return events;
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const eventData = generateYearEvents();