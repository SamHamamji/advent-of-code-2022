const firstDay = 1;
const lastDay = 25;

async function getPuzzleInput(day: number) {
    if (!(day >= firstDay && day <= lastDay)) {
        throw new Error(`${day} is not a valid day`);
    }
    return null;
}

export default { getPuzzleInput };