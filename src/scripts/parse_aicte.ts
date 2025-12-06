import * as fs from 'fs';
import * as path from 'path';

const rawPath = path.join(process.cwd(), 'src/data/aicte_raw.md');
const outputPath = path.join(process.cwd(), 'src/data/aicte_parsed.json');

const rawContent = fs.readFileSync(rawPath, 'utf-8');

interface ParsedInstitution {
    name: string;
    address: string;
    programs: { name: string; seats: number }[];
    rawId?: string;
}

const institutions: ParsedInstitution[] = [];

// Regex to match table rows: | col1 | col2 | col3 |
const rowRegex = /^\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/gm;

let match;
while ((match = rowRegex.exec(rawContent)) !== null) {
    const col1 = match[1].trim(); // Name & Address
    const col2 = match[2].trim(); // Courses
    const col3 = match[3].trim(); // Intake

    if (col1.includes('Institution Name') || col1.includes('---')) continue;

    // Parse Name & Address
    // Format: "**Name** Address ID" or "Name Address ID"
    // ID is usually at the end, digits.
    // Name is usually bolded **Name**.

    let name = '';
    let address = '';

    // Extract name (bolded or first part)
    const nameMatch = col1.match(/\*\*(.*?)\*\*/);
    if (nameMatch) {
        name = nameMatch[1];
        address = col1.replace(nameMatch[0], '').trim();
    } else {
        // No bold, assume name is first part before address?
        // Hard to distinguish. Let's look at examples.
        // "St. Aloysius Deemed To Be University Light House..." -> No bold in user text for this one?
        // User text: "| St. Aloysius Deemed To Be University Light House... |"
        // Actually, looking at the raw text, St Aloysius is NOT bolded in the second row?
        // Row 1: "**Yenepoya...**"
        // Row 2: "St. Aloysius..." (Not bolded in my manual transcription? Wait, let me check the file content I wrote)
        // I wrote: "| St. Aloysius Deemed To Be University Light House... |"
        // So I need to be smart.
        // Usually address starts with a capital letter, but name does too.
        // Maybe split by " - " pincode?
        // Address usually ends with " - 575xxx ID".
        // I can try to extract the ID first (digits at end).

        let tempCol1 = col1;
        const idMatch = tempCol1.match(/\s+(\d+)$/);
        if (idMatch) {
            // Remove ID
            tempCol1 = tempCol1.substring(0, tempCol1.length - idMatch[0].length).trim();
        }

        // Now tempCol1 is "Name Address".
        // If there is a bold part, that's the name.
        if (nameMatch) {
            // Already handled above, but let's refine.
            // name is nameMatch[1].
            // address is the rest.
        } else {
            // Heuristic: Split by known city names or just take the whole thing as name if short?
            // Or maybe the first line is name? Markdown table cells can't have newlines usually.
            // Let's assume the first significant chunk is the name.
            // "St. Aloysius Deemed To Be University Light House Hill Road..."
            // Maybe look for "University", "College", "Institute", "Polytechnic"?
            // Split at the first occurrence of " Mangaluru" or " Mangalore" or address-like terms?
            // This is tricky.
            // Let's use the full string as name for matching, and refine later if needed.
            name = tempCol1;
            address = tempCol1; // Duplicate for now
        }
    }

    // Clean address (remove name if it was bolded)
    if (nameMatch) {
        // address is already set above
        // Remove trailing ID from address
        address = address.replace(/\s+\d+$/, '').trim();
    } else {
        // Try to split name and address
        // "St. Aloysius Deemed To Be University Light House Hill Road..."
        // Name ends at "University"?
        const splitKeywords = ['University', 'College', 'Institute', 'Polytechnic', 'School'];
        let splitIdx = -1;
        for (const kw of splitKeywords) {
            const idx = name.indexOf(kw);
            if (idx !== -1) {
                // If it's "Institute of Technology", we want the end of that.
                // But "St. Aloysius Deemed To Be University" -> split after University.
                // "St. Joseph Engineering College" -> split after College.
                // "P.A. Polytechnic" -> split after Polytechnic.
                const endOfKw = idx + kw.length;
                if (splitIdx === -1 || endOfKw > splitIdx) {
                    splitIdx = endOfKw;
                }
            }
        }

        if (splitIdx !== -1) {
            address = name.substring(splitIdx).trim();
            name = name.substring(0, splitIdx).trim();
        }
    }

    // Parse Intake
    const intakeStr = col3;
    const intakes = intakeStr.split(/\s+/).map(s => parseInt(s, 10)).filter(n => !isNaN(n));

    // Parse Courses
    // Split by '•'
    const coursesParts = col2.split('•').map(s => s.trim()).filter(s => s);
    // The first part might contain a header like "**B.Tech Engineering**".
    // We should ignore headers.
    // Headers usually don't have a corresponding intake?
    // Wait, if we have N intakes and M courses parts.
    // If M > N, some are headers.
    // Usually headers are at the start of a group.
    // "Header • Course 1 • Course 2"
    // "Header Course 1 • Course 2" (No, usually "Header • Course 1")
    // Let's look at the raw text: "**B.Tech Engineering** • Artificial..."
    // So the first part is "**B.Tech Engineering**". This is a header.
    // The second part is "Artificial...". This is a course.

    // Strategy:
    // Filter out parts that look like headers (bolded, or known categories).
    // Or, align with intakes from the end?
    // If we have 13 intakes, we need 13 courses.
    // If we have 17 parts, the 4 extra are headers.
    // We can try to identify headers.

    const programs: { name: string; seats: number }[] = [];
    let intakeIdx = 0;

    for (const part of coursesParts) {
        // Check if it's a header
        const isHeader = part.startsWith('**') && part.endsWith('**');
        // Also check for known headers not bolded?
        // "PG", "Management", "Computer Applications"
        const cleanPart = part.replace(/\*\*/g, '').trim();
        const knownHeaders = ['B.Tech Engineering', 'B.E. / B.Tech', 'PG', 'Computer Applications', 'Management', 'Design', 'B.Tech', 'B.E.'];

        if (isHeader || knownHeaders.includes(cleanPart)) {
            continue; // Skip header
        }

        // It's a course
        if (intakeIdx < intakes.length) {
            programs.push({
                name: cleanPart,
                seats: intakes[intakeIdx]
            });
            intakeIdx++;
        }
    }

    institutions.push({
        name,
        address,
        programs
    });
}

fs.writeFileSync(outputPath, JSON.stringify(institutions, null, 2));
console.log(`Parsed ${institutions.length} institutions.`);
