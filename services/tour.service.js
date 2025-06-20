import { readFileSync, writeFile } from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const tours = JSON.parse(readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))
const getAllTours = () => {
    return tours;
}

const getTourById = (id) => {
    return tours.find(tour => tour.id === id);
}

const createTour = () => {

    /*   const newId = tours[tours.length - 1].id + 1;
     const tourWithId = { id: newId, ...newTour };
     tours.push(tourWithId);
     writeDataToFile(tours);
     return tourWithId;  */
}

const updateTour = (id, updatedTour) => {
    const index = tours.findIndex(tour => tour.id === id);
    if (index !== -1) {
        tours[index] = { id, ...updatedTour };
        writeDataToFile(tours);
        return true;
    }
    return false;
}

const writeDataToFile = (data) => {
    writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(data), (err) => {
        if (err) {
            console.log('Error writing to file:', err);
        }
    });
}

export { getAllTours, getTourById, createTour, updateTour };