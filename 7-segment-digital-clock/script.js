document.addEventListener('DOMContentLoaded', () => {
    const digitalClockElement = document.getElementById('digitalClock');

    // 7-segment display patterns for digits 0-9
    // Segments are typically named A-G:
    //   A
    // F   B
    //   G
    // E   C
    //   D
    // Array index corresponds to the digit (0-9)
    // Value is a string of segments that are ON (e.g., "abcdef" for 8)
    const digitPatterns = [
        "abcdef",  // 0
        "bc",      // 1
        "abged",   // 2
        "abgcd",   // 3
        "fgbc",    // 4
        "afgcd",   // 5
        "afgcde",  // 6
        "abc",     // 7
        "abcdefg", // 8
        "abcdfg"   // 9
    ];

    function createDigitElement() {
        const digitDiv = document.createElement('div');
        digitDiv.classList.add('digit');
        const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        segments.forEach(segId => {
            const segmentDiv = document.createElement('div');
            segmentDiv.classList.add('segment', segId);
            // Add h-segment or v-segment class based on segment ID
            if (['a', 'g', 'd'].includes(segId)) {
                segmentDiv.classList.add('h-segment');
            } else {
                segmentDiv.classList.add('v-segment');
            }
            digitDiv.appendChild(segmentDiv);
        });
        return digitDiv;
    }

    function createSeparatorElement() {
        const separatorDiv = document.createElement('div');
        separatorDiv.classList.add('separator');
        const dot1 = document.createElement('div');
        dot1.classList.add('dot');
        const dot2 = document.createElement('div');
        dot2.classList.add('dot');
        separatorDiv.appendChild(dot1);
        separatorDiv.appendChild(dot2);
        return separatorDiv;
    }

    // Create the clock structure (6 digits, 2 separators)
    const hourTens = createDigitElement();
    const hourOnes = createDigitElement();
    const minuteTens = createDigitElement();
    const minuteOnes = createDigitElement();
    const secondTens = createDigitElement();
    const secondOnes = createDigitElement();

    digitalClockElement.appendChild(hourTens);
    digitalClockElement.appendChild(hourOnes);
    digitalClockElement.appendChild(createSeparatorElement());
    digitalClockElement.appendChild(minuteTens);
    digitalClockElement.appendChild(minuteOnes);
    digitalClockElement.appendChild(createSeparatorElement());
    digitalClockElement.appendChild(secondTens);
    digitalClockElement.appendChild(secondOnes);

    function updateDigit(digitElement, digitValue) {
        const pattern = digitPatterns[digitValue] || ""; // Get pattern or empty if invalid
        const segments = digitElement.querySelectorAll('.segment');

        segments.forEach(segment => {
            // Check if the segment's class (a, b, c...) is in the pattern
            const segmentId = Array.from(segment.classList).find(cls => cls.length === 1 && /[a-g]/.test(cls));
            if (segmentId && pattern.includes(segmentId)) {
                segment.classList.add('on');
            } else {
                segment.classList.remove('on');
            }
        });
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours();    // 0-23
        const minutes = now.getMinutes();  // 0-59
        const seconds = now.getSeconds();  // 0-59

        // Update hour digits
        updateDigit(hourTens, Math.floor(hours / 10));
        updateDigit(hourOnes, hours % 10);

        // Update minute digits
        updateDigit(minuteTens, Math.floor(minutes / 10));
        updateDigit(minuteOnes, minutes % 10);

        // Update second digits
        updateDigit(secondTens, Math.floor(seconds / 10));
        updateDigit(secondOnes, seconds % 10);
    }

    // Initial call to display clock immediately
    updateClock();

    // Update the clock every second
    setInterval(updateClock, 1000);
});