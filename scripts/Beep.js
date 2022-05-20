/**
 * Ein wiederverwendbarer AudioContext
 */
let myAudioContext;

/**
 * Hilfsfunktion um einen Sound zu erzeugen mit Hilfe der Web Audio API.
 * Allgemeine Quelle im Netz
 *
 * @param {number} duration - Dauer des Tons in ms
 * @param {number} frequency - Frequenz des Tons
 * @param {number} volume - Lautstärke des Tons
 *
 * @returns {Promise} - Promise, nachdem die Ausgabe beendet wurde
 */
function beep(duration = 200, frequency = 400, volume = 100) {
    return new Promise((resolve, reject) => {
        try {
            let oscillatorNode = myAudioContext.createOscillator();
            let gainNode = myAudioContext.createGain();
            oscillatorNode.connect(gainNode);

            // Set the oscillator frequency in hertz
            oscillatorNode.frequency.value = frequency;

            // Set the type of oscillator
            oscillatorNode.type = "square";
            gainNode.connect(myAudioContext.destination);

            // Set the gain to the volume
            gainNode.gain.value = volume * 0.01;

            // Start audio with the desired duration
            oscillatorNode.start(myAudioContext.currentTime);
            oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

            // Resolve the promise when the sound is finished
            oscillatorNode.onended = () => {
                resolve();
            };
        } catch (error) {
            reject(error);
        }
    });
}