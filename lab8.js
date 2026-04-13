/**
Name:
Date:
Description:
Bugs: Write none known if you don't know of any
Reflection: Describe the steps you took to write this, and the problems you encountered along the way. 
            Include any LLM usage (but be sure and review the syllabus section specifying where LLMs can and cannot be used)
*/

import pg from 'pg';    // package for executing SQL in JavaScript
import dotenv from 'dotenv'; // to manage environment variables
dotenv.config();

const mySecret = process.env['CockroachDBPassword']; // reads from .env file at root 

const pool = new pg.Pool({
    user: 'YOUR_USER',
    host: 'your_cluster.cockroachlabs.cloud',
    database: 'your_database_name',
    password: mySecret,
    port: 26257,
    ssl: true,
});


/**
 * This illustrates the basic syntax for making a query, in this case, selecting
 * all movies in the table
 *
 * @async
 * @function demoSelect
 * @returns {Promise<void>} Asynchronous functions return Promises — in this case, a void one.
 */
async function demoSelect() {
    try {
        let results = await pool.query('SELECT * FROM movies');
        let movies = results.rows; // each row corresponds to one movie
        for (let movie of movies) {
            // do something spectacular here
        }
    } catch (error) {
        console.log(`An error has occurred while selecting: ${error}`);
    }
}
//query92(year)
async function query92(year) {
    try {
        const result = await pool.query(
            `SELECT first_name, last_name
             FROM directors
             WHERE birth_year > $1
             ORDER BY last_name`,
            [year]
        );

        for (let row of result.rows) {
            console.log(`${row.first_name} ${row.last_name}`);
        }

    } catch (error) {
        console.log(`Error in query92: ${error}`);
    }
}

//query93

async function query93(min_gross, max_gross, symbol) {
    try {
        const result = await pool.query(
            `SELECT name, rotten_tomatoes_score
             FROM movies
             WHERE gross_earnings BETWEEN $1 AND $2`,
            [min_gross, max_gross]
        );

        for (let row of result.rows) {
            const count = row.rotten_tomatoes_score % 10;
            const repeated = symbol.repeat(count);
            console.log(`${row.name}(${repeated})`);
        }

    } catch (error) {
        console.log(`Error in query93: ${error}`);
    }
}

//profitMatters

async function profitMatters() {
    try {
        const result = await pool.query(
            `SELECT gross_earnings, rotten_tomatoes_score FROM movies`
        );

        const xs = result.rows.map(r => Number(r.gross_earnings));
        const ys = result.rows.map(r => Number(r.rotten_tomatoes_score));

        const n = xs.length;

        const mean = arr => arr.reduce((a, b) => a + b, 0) / n;

        const xBar = mean(xs);
        const yBar = mean(ys);

        let numerator = 0;
        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < n; i++) {
            const dx = xs[i] - xBar;
            const dy = ys[i] - yBar;

            numerator += dx * dy;
            sumX += dx * dx;
            sumY += dy * dy;
        }

        const r = numerator / Math.sqrt(sumX * sumY);

        console.log(`Pearson r: ${r}`);

    } catch (error) {
        console.log(`Error in profitMatters: ${error}`);
    }
}

// While this needn't be called main(), it's as good a name as any.

async function main() {
    await demoSelect(); // Since we are awaiting demoSelect(), we must mark main() as async
}

main();
