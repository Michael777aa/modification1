$(function () {
  // Handle product status change
  $("#process-btn").on("click", () => {
    $(".dish-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    $(".dish-container").slideToggle(100);
    $("#cancel-btn").css("display", "flex");
  });

  // Cancel button logic to just hide form and keep the state
  $("#cancel-btn").on("click", function () {
    // Hide the form and show the "New Product" button

    $("#process-btn").css("display", "flex");
  });

  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id;
    const productStatus = $(`#${id}.new-product-status`).val();

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });

      // Disable sale input if product is not ONSALE or status is Process/Delete/Pause
      if (
        ["Process", "Delete", "Pause", "ONSALE"].indexOf(productStatus) === -1
      ) {
        $(`#sale-${id}`).prop("disabled", true); // Disable sale input
        // Set sale price to N/A or remove it
        $(`#sale-price-${id}`).val();
      } else if (productStatus === "ONSALE") {
        $(`#sale-${id}`).prop("disabled", false); // Enable sale input
      }

      $(".new-product-status").blur();
    } catch (err) {
      console.log(err);
      alert("Product update failed!");
    }
  });

  // Handle sale percentage update
  $(".product-sale-input").on("input", function () {
    const val = $(this).val();

    if (val.includes(".")) {
      const correctedVal = Math.floor(parseFloat(val)); // Remove decimal portion
      $(this).val(correctedVal); // Set the corrected value
      alert(
        "Sale percentage must be a whole number. Decimal values are not allowed."
      );
    }
  });

  $(".update-sale-btn").on("click", async function (e) {
    const id = $(this).data("id");
    const productSale = $(`#sale-${id}`).val();
    const productPrice = $(`#price-${id}`).text(); // Assuming productPrice is displayed as text
    const productStatus = $(`#${id}.new-product-status`).val();

    // Validate sale percentage and price
    if (productStatus !== "ONSALE") {
      alert(
        "Sale percentage can only be updated for products that are 'ONSALE'!"
      );
      return;
    }

    // Check if sale percentage is 0 or empty (remove sale)
    if (!productSale || isNaN(productSale) || Number(productSale) <= 0) {
      const confirmRemove = confirm(
        "Are you sure you want to remove the sale percentage and revert to the original price?"
      );
      if (confirmRemove) {
        try {
          // Send a request to remove the sale percentage and revert the price to the original
          const response = await axios.post(`/admin/product/${id}`, {
            productSale: 0,
            productSalePrice: null, // Remove the sale price
          });

          const result = response.data;
          if (result.data) {
            alert("Sale percentage removed successfully!");
            $(`#sale-price-${id}`).text(null); // Revert to original price

            $(`#sale-${id}`).val(""); // Clear the sale input field
          } else {
            alert("Failed to remove sale percentage!");
          }
        } catch (err) {
          console.log("Error:", err);
          alert("Failed to remove sale percentage!");
        }
      }
      return;
    }

    // Validate if sale percentage is more than 100
    if (Number(productSale) > 100) {
      alert("Sale percentage cannot exceed 100%!");
      return;
    }

    // Calculate the sale price
    const numericProductPrice = parseFloat(productPrice);
    const numericProductSale = parseFloat(productSale);
    const productSalePrice =
      numericProductPrice - (numericProductPrice * numericProductSale) / 100;

    try {
      // Send a POST request to update the sale percentage and sale price
      const response = await axios.post(`/admin/product/${id}`, {
        productSale: numericProductSale,
        productSalePrice: Math.floor(productSalePrice),
      });

      const result = response.data;
      if (result.data) {
        alert("Product sale percentage and price updated successfully!");
        $(`#sale-price-${id}`).text(Math.floor(productSalePrice)); // Update sale price display
      } else {
        alert("Product update failed!");
      }
    } catch (err) {
      console.log("Error:", err);
      alert("Product update failed!");
    }
  });
});

function validateForm() {
  const productName = $(".product-name").val();
  const productPrice = $(".product-price").val();
  const productLeftCount = $(".product-left-count").val();
  const productCollection = $(".product-desc").val();
  const productDesc = $(".product-name").val();
  const productStatus = $(".product-status").val();

  if (
    productName === "" ||
    productPrice === "" ||
    productLeftCount === "" ||
    productCollection === "" ||
    productDesc === "" ||
    productStatus === ""
  ) {
    alert("Please insert all required inputs");
    return false;
  } else return true;
}

function previewFileHandler(input, order) {
  const imgClassName = input.className;
  const file = $(`.${imgClassName}`).get(0).files[0],
    fileType = file["type"],
    validImageType = ["image/jpg", "image/jpeg", "image/png"];
  if (!validImageType.includes(fileType)) {
    alert("Please, insert only jpeg, jpg and png!");
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
