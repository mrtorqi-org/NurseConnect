from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class EmailAuthenticationTests(APITestCase):
	def test_register_and_login_with_email(self):
		register_response = self.client.post(
			reverse('register'),
			{
				'name': 'Test Nurse',
				'email': 'test.nurse@example.com',
				'password': 'StrongPass123!',
				'password_confirm': 'StrongPass123!',
				'role': 'candidate',
			},
			format='json',
		)

		self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(register_response.data['user']['email'], 'test.nurse@example.com')
		self.assertEqual(register_response.data['user']['first_name'], 'Test')
		self.assertEqual(register_response.data['user']['last_name'], 'Nurse')

		login_response = self.client.post(
			reverse('login'),
			{'email': 'test.nurse@example.com', 'password': 'StrongPass123!'},
			format='json',
		)

		self.assertEqual(login_response.status_code, status.HTTP_200_OK)
		self.assertEqual(login_response.data['user']['email'], 'test.nurse@example.com')
