import React, { useEffect, useState } from "react";
import axios from "axios";
import { useShop } from "./ShopContext";
import {
  Button,
  Box,
  Text,
  Spinner,
  Flex,
  CloseButton,
  VStack,
  Input,
  Separator,
} from "@chakra-ui/react";
import { LuShoppingCart } from "react-icons/lu";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";

const Products = () => {
  const { products, setProducts, addToCart, cart, removeFromCart, clearCart } = useShop();
  const sum = cart.reduce((s, p) => s + p.price, 0);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [blikCode, setBlikCode] = useState("");

  const isAddressValid = address.length >= 10;
  const isPhoneValid = /^\d{9}$/.test(phone);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isBlikValid = /^\d{6}$/.test(blikCode);
  const isFormValid = isAddressValid && isPhoneValid && isEmailValid && isBlikValid;

  useEffect(() => {
    axios
      .get("http://localhost:1323/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania produktów:", error);
      });
  }, [setProducts]);

  const handlePayment = async () => {
    if (!isFormValid) return;
    try {
      await axios.post("http://localhost:1323/payment", {
        cart: { products: cart },
        totalPrice: sum,
        userDetails: { address, phone, email, blikCode }
      });
      clearCart();
      setAddress("");
      setPhone("");
      setEmail("");
      setBlikCode("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box bg="orange.50" p={10} display="flex" flexDirection="column" alignItems="center" minH="100vh">
      <Box bg="white" p={6} borderRadius="xl" boxShadow="lg" width="80%" maxW="1200px" mb={10}>
        <Text fontSize="2xl" mb={4} fontWeight="bold" color="orange.600">Our Products</Text>
        {products.length === 0 ? (
          <Spinner size="xl" color="orange.400" />
        ) : (
          products.map((item) => (
            <Flex key={item.id} justify="space-between" align="center" p={3} borderBottom="1px solid #ddd">
              <Text>{item.name} - {item.price} zł</Text>
              <Button onClick={() => addToCart(item)} size="sm" bg="orange.400" color="white" _hover={{ bg: "orange.600" }}>
                Add to Cart
              </Button>
            </Flex>
          ))
        )}
      </Box>

      
      <Box bg="white" p={6} borderRadius="xl" boxShadow="lg" width="80%" maxW="1200px">
        <Text fontSize="2xl" mb={4} fontWeight="bold" color="orange.600">Your Cart</Text>
        {cart.length === 0 ? (
          <Flex direction="column" align="center" justify="center" color="gray.500">
            <Box fontSize="4xl" mb={2}><LuShoppingCart /></Box>
            <Text fontWeight="bold">Your cart is empty</Text>
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {cart.map((p, i) => (
              <Box key={i}>
                <Flex justify="space-between" align="center">
                  <Text>{p.name} - {p.price} zł</Text>
                  <CloseButton class="remove-button" onClick={() => removeFromCart(i)} size="sm" color="red.500" _hover={{ bg: "red.600" }} />
                </Flex>
                <Separator mt={2} mb={2} />
              </Box>
            ))}
            <Text fontWeight="bold">Sum: {sum} zł</Text>
          </VStack>
        )}
      </Box>

      <Box bg="white" p={6} borderRadius="xl" boxShadow="lg" width="80%" maxW="1200px" mt={6}>
        <Text fontSize="2xl" mb={4} fontWeight="bold" color="orange.600">User Details</Text>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!isAddressValid}>
            <FormLabel>Address</FormLabel>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            {!isAddressValid && <FormErrorMessage color="red" >Address must be at least 10 characters.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!isPhoneValid}>
            <FormLabel>Phone</FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            {!isPhoneValid && <FormErrorMessage color="red" >Phone must be 9 digits.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!isEmailValid}>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            {!isEmailValid && <FormErrorMessage color="red">Invalid email format.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!isBlikValid}>
            <FormLabel>BLIK Code</FormLabel>
            <Input value={blikCode} onChange={(e) => setBlikCode(e.target.value)} />
            {!isBlikValid && <FormErrorMessage color="red">BLIK Code must be 6 digits.</FormErrorMessage>}
          </FormControl>
          <Button backgroundColor="orange.400" color="white" size="md" _hover={{ bg: "orange.600" }} onClick={handlePayment} isDisabled={!isFormValid}>
            Buy
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Products;
