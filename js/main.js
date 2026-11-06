document.addEventListener("DOMContentLoaded", function () {

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {

        bookingForm.addEventListener("submit", function (event) {

            event.preventDefault();

            // Read customer information
            const customerName = document.getElementById("customerName").value.trim();
            const customerEmail = document.getElementById("customerEmail").value.trim();

            // Read equipment selection
            const quantity = document.getElementById("quantity").value;
            const equipmentPackage = document.getElementById("equipmentPackage").value;

            // Read optional upgrades
            const aiAssistant = document.getElementById("aiAssistant").checked;
            const energyShield = document.getElementById("energyShield").checked;

            // Get error message elements
            const customerNameError = document.getElementById("customerNameError");
            const customerEmailError = document.getElementById("customerEmailError");
            const quantityError = document.getElementById("quantityError");
            const equipmentPackageError = document.getElementById("equipmentPackageError");

            // Clear previous error messages
            customerNameError.textContent = "";
            customerEmailError.textContent = "";
            quantityError.textContent = "";
            equipmentPackageError.textContent = "";

            // Track validation status
            let isValid = true;

            // Validate Customer Name
            if (customerName === "") {
                customerNameError.textContent = "Full Name is required.";
                isValid = false;
            }

            // Validate Customer Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (customerEmail === "") {
                customerEmailError.textContent = "Email Address is required.";
                isValid = false;
            } else if (!emailPattern.test(customerEmail)) {
                customerEmailError.textContent = "Please enter a valid email address.";
                isValid = false;
            }

            // Validate Quantity
            if (quantity.trim() === "") {
                quantityError.textContent = "Quantity is required.";
                isValid = false;
            } else if (
                !Number.isInteger(Number(quantity)) ||
                Number(quantity) < 1 ||
                Number(quantity) > 20
            ) {
                quantityError.textContent = "Quantity must be a whole number between 1 and 20.";
                isValid = false;
            }

            // Validate Equipment Package
            const validPackages = ["150", "290", "480"];

            if (equipmentPackage === "") {
                equipmentPackageError.textContent = "Please select an equipment package.";
                isValid = false;
            } else if (!validPackages.includes(equipmentPackage)) {
                equipmentPackageError.textContent = "Invalid equipment package selected.";
                isValid = false;
            }

            // Stop processing if validation fails
            if (!isValid) {
                document.getElementById("bookingResult").hidden = true;
                return;
            }

            // Temporary console output for testing
            console.log("Customer Name:", customerName);
            console.log("Customer Email:", customerEmail);
            console.log("Quantity:", quantity);
            console.log("Equipment Package:", equipmentPackage);
            console.log("AI Assistant:", aiAssistant);
            console.log("Energy Shield:", energyShield);

            // Convert input values to numbers
            const quantityNumber = Number(quantity);
            const packagePrice = Number(equipmentPackage);

            // Calculate optional upgrade prices
            let extrasPerUnit = 0;

            if (aiAssistant) {
                extrasPerUnit += 50;
            }

            if (energyShield) {
                extrasPerUnit += 80;
            }

            // Calculate price per unit
            const pricePerUnit = packagePrice + extrasPerUnit;

            // Calculate total booking cost
            const totalCost = pricePerUnit * quantityNumber;

            // Format amount in Malaysian Ringgit
            const formattedTotal = "RM" + totalCost.toFixed(2);

            // Display calculation in Console
            console.log("Package Price:", packagePrice);
            console.log("Extras Per Unit:", extrasPerUnit);
            console.log("Price Per Unit:", pricePerUnit);
            console.log("Quantity:", quantityNumber);
            console.log("Total Booking Cost:", formattedTotal);

            // Ask user to confirm the booking
            const confirmBooking = confirm(
                "Please confirm your equipment booking.\n\n" +
                "Customer: " + customerName + "\n" +
                "Quantity: " + quantityNumber + "\n" +
                "Total Cost: " + formattedTotal + "\n\n" +
                "Do you want to proceed?"
            );

            // Handle booking cancellation
            if (!confirmBooking) {

                // Hide any previous Booking Summary
                document.getElementById("bookingResult").hidden = true;

                // Clear previous summary details
                document.getElementById("resultDetails").replaceChildren();

                alert("Booking cancelled. You can review your details and try again.");

                return;
            }

            // Inform user that booking is confirmed
            alert("Booking confirmed successfully!");

            // Get result elements
            const bookingResult = document.getElementById("bookingResult");
            const resultDetails = document.getElementById("resultDetails");

            // Get selected package name
            const packageSelect = document.getElementById("equipmentPackage");
            const packageName =
                packageSelect.options[packageSelect.selectedIndex].text
                .split(" - ")[0];

            // Get selected optional upgrades
            const selectedExtras = [];

            if (aiAssistant) {
                selectedExtras.push("AI Assistant Module");
            }

            if (energyShield) {
                selectedExtras.push("Energy Shield Upgrade");
            }

            const extrasText = selectedExtras.length > 0
                ? selectedExtras.join(", ")
                : "None";

            // Clear previous result
            resultDetails.replaceChildren();

            // Helper function to create a summary row safely
            function addSummaryRow(label, value) {
                const row = document.createElement("p");
                const labelElement = document.createElement("strong");

                labelElement.textContent = label + ": ";
                row.appendChild(labelElement);
                row.appendChild(document.createTextNode(value));

                resultDetails.appendChild(row);
            }

            // Display booking information
            addSummaryRow("Customer Name", customerName);
            addSummaryRow("Email", customerEmail);
            addSummaryRow("Equipment Package", packageName);
            addSummaryRow("Quantity", quantityNumber + " unit(s)");
            addSummaryRow("Optional Upgrades", extrasText);

            // Display price breakdown
            addSummaryRow(
                "Package Price",
                "RM" + packagePrice.toFixed(2) + " / unit"
            );

            addSummaryRow(
                "Upgrades Price",
                "RM" + extrasPerUnit.toFixed(2) + " / unit"
            );

            addSummaryRow(
                "Price Per Unit",
                "RM" + pricePerUnit.toFixed(2)
            );

            // Display total cost
            const totalHeading = document.createElement("h4");
            totalHeading.className = "mt-3";
            totalHeading.textContent =
                "Total Booking Cost: " + formattedTotal;

            resultDetails.appendChild(totalHeading);

            // Show Booking Summary panel
            bookingResult.hidden = false;

            // Scroll to Booking Summary
            bookingResult.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });
        
        bookingForm.addEventListener("reset", function () {

            // Clear all validation error messages
            document.getElementById("customerNameError").textContent = "";
            document.getElementById("customerEmailError").textContent = "";
            document.getElementById("quantityError").textContent = "";
            document.getElementById("equipmentPackageError").textContent = "";

            // Hide Booking Summary
            const bookingResult = document.getElementById("bookingResult");
            bookingResult.hidden = true;

            // Clear previous Booking Summary details
            document.getElementById("resultDetails").replaceChildren();

            // Move focus back to Customer Name
            // after the browser completes its native reset
            requestAnimationFrame(function () {
                document.getElementById("customerName").focus();
            });

        });
    }
});