export const doctors = [
    {
        id: "1",
        name: "Arjun Patel",
        specialization: "Cardiologist",
        experience: 8,
        visitingTime: "10:00 AM - 4:00 PM",
        days: "Mon - Fri",
        hospital: "City Care Hospital",
        location: "Chennai",
        rating: 4.8,
        fee: 500,
        available: true,
        slots: ["10:00 AM", "11:00 AM", "2:00 PM"],
        status: "Approved", // ✅ ADD THIS
    },
    {
        id: "2",
        name: "Kavya Rao",
        specialization: "Neurologist",
        experience: 6,
        visitingTime: "9:00 AM - 2:00 PM",
        days: "Mon - Sat",
        hospital: "Apollo Clinic",
        location: "Bangalore",
        rating: 4.6,
        fee: 600,
        available: true,
        slots: ["9:00 AM", "10:30 AM", "1:00 PM"],
        status: "Pending", // ✅ ADD THIS
    },
];
