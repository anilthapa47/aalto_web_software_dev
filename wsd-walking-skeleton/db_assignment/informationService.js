import * as informationRepository from "./informationRepository.js";

const getInformation = (c) => {
  return  informationRepository.getInformation();
  //return c.json(data);
};

const setInformation = (newInformation) => {
  informationRepository.setInformation(newInformation);
};

export { getInformation, setInformation };