import * as informationService from "./informationService.js"
const getInformation = (c) => {
    return c.json(informationService.getInformation(c));
    // return c.json(data);
};

const setInformation = async (c) => {
    const json = await c.req.json();
    informationService.setInformation(json.information);
    return c.json({ message: "Information updated." });
};

export { getInformation, setInformation };