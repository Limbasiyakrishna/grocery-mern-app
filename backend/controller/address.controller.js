import Address from "../models/address.model.js";
// add address :/api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user;
    
    if (!address) {
      return res.status(400).json({ success: false, message: "Address details required" });
    }

    // Ensure required fields are present
    if (!address.firstName || !address.lastName || !address.email || !address.street || 
        !address.city || !address.state || !address.zipCode || !address.phone) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const savedAddress = await Address.create({
      userId,
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country || "India",
      phone: address.phone,
      addressType: address.addressType || "Home",
    });

    res.status(201).json({ success: true, message: "Address added successfully", address: savedAddress });
  } catch (error) {
    console.error("Address add error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

//get address:// /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.user;
    const addresses = await Address.find({ userId });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
