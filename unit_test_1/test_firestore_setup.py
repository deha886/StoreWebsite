import unittest
from unittest.mock import patch, MagicMock
from firestore_setup import add_user, get_user, update_user, delete_user


class TestFirestoreSetup(unittest.TestCase):
    @patch("firestore_setup.firestore.client")
    def setUp(self, mock_firestore_client):
        """Mock Firestore client for all tests."""
        self.mock_db = MagicMock()
        mock_firestore_client.return_value = self.mock_db
        self.mock_collection = self.mock_db.collection.return_value
        self.mock_document = self.mock_collection.document.return_value

        # Default mock behaviors
        self.mock_document.get.return_value = MagicMock(
            exists=True, to_dict=lambda: {"name": "Test User", "email": "test@example.com"}
        )
        self.mock_document.set.return_value = None
        self.mock_document.update.return_value = None
        self.mock_document.delete.return_value = None

    # --- ADD USER TESTS ---
    def test_add_user_valid_data(self):
        user_id = "valid_user"
        user_data = {"name": "Test User", "email": "test@example.com"}
        add_user(user_id, user_data)
        self.mock_collection.document.assert_called_with(user_id)
        self.mock_document.set.assert_called_with(user_data)

    def test_add_user_empty_data(self):
        user_id = "empty_user"
        user_data = {}
        add_user(user_id, user_data)
        self.mock_collection.document.assert_called_with(user_id)
        self.mock_document.set.assert_called_with(user_data)

    def test_add_user_special_characters(self):
        user_id = "special_user"
        user_data = {"name": "Name #@!", "email": "email@domain.com"}
        add_user(user_id, user_data)
        self.mock_document.set.assert_called_with(user_data)

    def test_add_user_large_payload(self):
        user_id = "large_user"
        user_data = {"name": "Large User", "bio": "x" * 10000}
        add_user(user_id, user_data)
        self.mock_collection.document.assert_called_with(user_id)
        self.mock_document.set.assert_called_with(user_data)

    def test_add_user_missing_field(self):
        user_id = "missing_field_user"
        user_data = {"name": "Missing Email"}
        add_user(user_id, user_data)
        self.mock_document.set.assert_called_with(user_data)

    # --- GET USER TESTS ---
    def test_get_user_exists(self):
        user_data = get_user("existing_user")
        self.assertEqual(user_data, {"name": "Test User", "email": "test@example.com"})

    def test_get_user_nonexistent(self):
        self.mock_document.get.return_value = MagicMock(exists=False)
        user_data = get_user("nonexistent_user")
        self.assertIsNone(user_data)

    def test_get_user_large_document(self):
        large_data = {"field": "x" * 100000}
        self.mock_document.get.return_value = MagicMock(exists=True, to_dict=lambda: large_data)
        user_data = get_user("large_user")
        self.assertEqual(user_data, large_data)

    def test_get_user_api_failure(self):
        self.mock_document.get.side_effect = Exception("API failure")
        with self.assertRaises(Exception):
            get_user("failing_user")

    def test_get_user_null_field(self):
        self.mock_document.get.return_value = MagicMock(
            exists=True, to_dict=lambda: {"name": None, "email": "test@example.com"}
        )
        user_data = get_user("null_field_user")
        self.assertEqual(user_data, {"name": None, "email": "test@example.com"})

    # --- UPDATE USER TESTS ---
    def test_update_user_valid_data(self):
        user_id = "valid_user"
        updated_data = {"email": "updated@example.com"}
        update_user(user_id, updated_data)
        self.mock_document.update.assert_called_with(updated_data)

    def test_update_user_no_data(self):
        user_id = "valid_user"
        with self.assertRaises(ValueError):
            update_user(user_id, {})

    def test_update_user_invalid_field(self):
        user_id = "invalid_field_user"
        updated_data = {"unknown_field": "data"}
        update_user(user_id, updated_data)
        self.mock_document.update.assert_called_with(updated_data)

    def test_update_user_partial_update(self):
        user_id = "partial_update_user"
        updated_data = {"email": "new@example.com"}
        update_user(user_id, updated_data)
        self.mock_document.update.assert_called_with(updated_data)

    def test_update_user_network_error(self):
        self.mock_document.update.side_effect = Exception("Network error")
        with self.assertRaises(Exception):
            update_user("network_error_user", {"email": "test@example.com"})

    # --- DELETE USER TESTS ---
    def test_delete_user_valid_user(self):
        user_id = "valid_user"
        delete_user(user_id)
        self.mock_document.delete.assert_called_once()

    def test_delete_user_nonexistent_user(self):
        self.mock_document.delete.side_effect = Exception("Document does not exist")
        with self.assertRaises(Exception):
            delete_user("nonexistent_user")

    def test_delete_user_network_error(self):
        self.mock_document.delete.side_effect = Exception("Network error")
        with self.assertRaises(Exception):
            delete_user("network_error_user")

    def test_delete_user_null_id(self):
        with self.assertRaises(TypeError):
            delete_user(None)

    def test_delete_user_empty_id(self):
        with self.assertRaises(ValueError):
            delete_user("")

    # --- EDGE CASES ---
    def test_edge_case_add_null_user_id(self):
        with self.assertRaises(TypeError):
            add_user(None, {"name": "Test"})

    def test_edge_case_update_empty_data(self):
        user_id = "edge_user"
        with self.assertRaises(ValueError):
            update_user(user_id, {})

    def test_edge_case_get_special_id(self):
        special_id = "user!@#"
        user_data = get_user(special_id)
        self.assertEqual(user_data, {"name": "Test User", "email": "test@example.com"})

    def test_edge_case_delete_special_id(self):
        special_id = "user!@#"
        delete_user(special_id)
        self.mock_document.delete.assert_called_once()

    def test_edge_case_large_user_id(self):
        user_id = "x" * 1000
        add_user(user_id, {"name": "Large ID User"})
        self.mock_collection.document.assert_called_with(user_id)


if __name__ == "__main__":
    unittest.main()
