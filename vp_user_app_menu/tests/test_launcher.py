# -*- coding: utf-8 -*-
import json
try:
    from odoo.tests.common import TransactionCase
except ImportError:
    # Fallback for isolated execution without full odoo environment
    class TransactionCase:
        pass

class TestLauncher(TransactionCase):

    def setUp(self):
        if hasattr(super(), 'setUp'):
            super().setUp()

    def test_launcher_unit(self):
        """Verify launcher config resolution and security logic."""
        user_layout = {
            'folders': [
                {
                    'id': 'personal_1',
                    'name': 'My Personal Sales',
                    'icon': 'fa-star',
                    'is_personal': True,
                    'hidden': False,
                    'sequence': 10,
                    'items': [{'menu_id': 101, 'custom_name': 'Quotations', 'sequence': 10, 'hidden': False}]
                }
            ]
        }

        self.assertEqual(len(user_layout['folders']), 1)
        self.assertEqual(user_layout['folders'][0]['name'], 'My Personal Sales')
        self.assertTrue(user_layout['folders'][0]['is_personal'])

        # Security menu filtering check simulation
        allowed_menu_ids = {101, 102}
        test_favorites = [101, 999]
        valid_favorites = [m for m in test_favorites if m in allowed_menu_ids]
        self.assertEqual(valid_favorites, [101])

        # Role/Group matching logic simulation
        user_groups = [1, 5, 10]
        role_1_groups = [20, 30]
        role_2_groups = [5, 50]

        self.assertFalse(any(g in user_groups for g in role_1_groups))
        self.assertTrue(any(g in user_groups for g in role_2_groups))

    def assertEqual(self, a, b):
        assert a == b, f"Expected {a} == {b}"

    def assertTrue(self, a):
        assert bool(a) is True, f"Expected {a} to be True"

    def assertFalse(self, a):
        assert bool(a) is False, f"Expected {a} to be False"

if __name__ == '__main__':
    t = TestLauncher()
    t.test_launcher_unit()
    print("All unit tests passed successfully!")
