from selenium import webdriver
from selenium.webdriver.common.by import By
import pytest
import time

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000")
    yield driver
    driver.quit()

def test_page_load(driver):
    time.sleep(0.5)
    assert "Our Products" in driver.page_source
    assert "Your Cart" in driver.page_source
    assert "User Details" in driver.page_source

def test_fetch_products(driver):
    time.sleep(0.5)
    products = driver.find_elements(By.CSS_SELECTOR, "button")
    assert len(products) > 0, "No products found on the page"

def test_add_to_cart(driver):
    time.sleep(0.5)
    add_buttons = driver.find_elements(By.CSS_SELECTOR, "button")
    add_buttons[0].click()
    time.sleep(0.5)
    cart_items = driver.find_elements(By.CSS_SELECTOR, "div")
    assert len(cart_items) > 0, "Product not added to cart"

def test_remove_from_cart(driver):
    time.sleep(0.5)
    add_buttons = driver.find_elements(By.CSS_SELECTOR, "button")
    add_buttons[0].click()
    time.sleep(0.5)
    close_buttons = driver.find_elements(By.CLASS_NAME, "css-83f9fn")
    close_buttons[0].click()
    time.sleep(0.5)
    assert "Your cart is empty" in driver.page_source

    add_buttons[0].click()
    add_buttons[1].click()
    time.sleep(0.5)
    cart_items = driver.find_elements(By.CLASS_NAME, "css-1lekzkb")
    assert len(cart_items) == 2, "There should be 2 items in the cart"

def test_invalid_address(driver):
    time.sleep(0.5)
    address_input = driver.find_elements(By.CSS_SELECTOR, "input")
    address_input[0].send_keys("Short")
    time.sleep(0.5)
    error_message = driver.find_element(By.CLASS_NAME, "chakra-form__error-message")
    assert error_message, "No error message for short address"

    time.sleep(0.5)
    address_input[0].send_keys("Valid address")
    time.sleep(0.5)
    error_messages = driver.find_elements(By.CLASS_NAME, "chakra-form__error-message")
    assert error_messages[0].text != "Address must be at least 10 characters.", "Error message for valid address"

def test_invalid_phone(driver):
    time.sleep(0.5)
    phone_input = driver.find_elements(By.CSS_SELECTOR, "input")
    phone_input[1].send_keys("12345")
    time.sleep(0.5)
    error_message = driver.find_element(By.CLASS_NAME, "chakra-form__error-message")
    assert error_message, "No error message for short phone number"
    time.sleep(0.5)
    phone_input[1].send_keys("4232")
    time.sleep(0.5)
    error_messages = driver.find_elements(By.CLASS_NAME, "chakra-form__error-message")
    assert error_messages[1].text != "Phone must be 9 digits.", "Error message for valid phone number"

def test_email_without_at(driver):
    time.sleep(0.5)
    email_input = driver.find_elements(By.CSS_SELECTOR, "input")
    email_input[2].send_keys("testexample.com")
    time.sleep(0.5)
    error_message = driver.find_element(By.CLASS_NAME, "chakra-form__error-message")
    assert error_message, "No error message with email without '@'"

def test_email_with_dot_end(driver):
    time.sleep(0.5)
    email_input = driver.find_elements(By.CSS_SELECTOR, "input")
    email_input[2].send_keys("test@example.")
    time.sleep(0.5)
    error_message = driver.find_element(By.CLASS_NAME, "chakra-form__error-message")
    assert error_message, "No error message with email with dot at the end"

    email_input[2].send_keys("com")
    time.sleep(0.5)
    error_messages = driver.find_elements(By.CLASS_NAME, "chakra-form__error-message")
    assert error_messages[2].text != "Phone must be 9 digits.", "Error message for email"

def test_blik_code(driver):
    time.sleep(0.5)
    blik_input = driver.find_elements(By.CSS_SELECTOR, "input")
    blik_input[3].send_keys("12523")
    time.sleep(0.5)
    error_message = driver.find_element(By.CLASS_NAME, "chakra-form__error-message")
    assert error_message, "No error message with 5 digit BLIK code"
    time.sleep(0.5)
    blik_input[3].send_keys("1")
    time.sleep(0.5)
    error_messages = driver.find_elements(By.CLASS_NAME, "chakra-form__error-message")
    assert error_messages[2].text != "BLIK code must be 6 digits.", "Error message for BLIK code"

def test_valid_payment_and_clear_cart(driver):
    time.sleep(0.5)
    inputs = driver.find_elements(By.CSS_SELECTOR, "input")
    inputs[0].send_keys("Valid address")
    inputs[1].send_keys("222333444")
    inputs[2].send_keys("test@gmail.com")
    inputs[3].send_keys("524694")
    time.sleep(0.5)
    error_messages = driver.find_elements(By.CLASS_NAME, "chakra-form__error-message")
    assert len(error_messages) == 0, "No error messages should be displayed for valid input"
    buy_button = driver.find_elements(By.CSS_SELECTOR, "button:not([disabled])")
    buy_button[5].click()
    time.sleep(1)
    inputs = driver.find_elements(By.CSS_SELECTOR, "input")
    time.sleep(1)
    assert "Your cart is empty" in driver.page_source, "Koszyk nie został wyczyszczony"
    assert inputs[0].get_attribute("value") == "", "Field address is not empty"
    assert inputs[1].get_attribute("value") == "", "Field phone is not empty"
    assert inputs[2].get_attribute("value") == "", "Field email is not empty"
    assert inputs[3].get_attribute("value") == "", "Field BLIK code is not empty"
