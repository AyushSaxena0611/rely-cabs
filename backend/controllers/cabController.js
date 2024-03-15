import Cab from "../models/cabModel.js";

const getCabs = async (req, res) => {
  try {
    const cabs = await Cab.find({});
    res.json(cabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCabById = async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    res.json(cab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { getCabs, getCabById };