const data = {
    information: "Hello, World!", // some generic string information
};

const getInformation = () => {
    return data;
};

const setInformation = (newInformation) => {
    data.information = newInformation;
};

export { getInformation, setInformation };