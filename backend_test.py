#!/usr/bin/env python3
"""
Backend API Test Suite for BEZARA Kemuel Portfolio
Tests all API endpoints and functionality
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

class PortfolioAPITester:
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url.rstrip('/')
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            'name': name,
            'success': success,
            'details': details
        })

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                return False, {}, 0
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
            
            return response.status_code < 400, response_data, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}, 0

    def test_health_check(self):
        """Test health check endpoint"""
        success, data, status = self.make_request('GET', '/api/health')
        
        if success and status == 200:
            if data.get('status') == 'healthy':
                self.log_test("Health Check", True)
                return True
            else:
                self.log_test("Health Check", False, f"Unexpected response: {data}")
        else:
            self.log_test("Health Check", False, f"Status: {status}, Data: {data}")
        return False

    def test_seed_data(self):
        """Test seeding sample data"""
        success, data, status = self.make_request('POST', '/api/seed-data')
        
        if success and status == 200:
            if 'message' in data and 'successfully' in data['message']:
                self.log_test("Seed Data", True)
                return True
            else:
                self.log_test("Seed Data", False, f"Unexpected response: {data}")
        else:
            self.log_test("Seed Data", False, f"Status: {status}, Data: {data}")
        return False

    def test_get_projects(self):
        """Test getting all projects"""
        success, data, status = self.make_request('GET', '/api/projects')
        
        if success and status == 200:
            if isinstance(data, list) and len(data) > 0:
                # Check if featured project exists
                featured_projects = [p for p in data if p.get('featured', False)]
                journal_project = [p for p in data if 'Journal de Caisse' in p.get('title', '')]
                
                if featured_projects and journal_project:
                    self.log_test("Get Projects (with featured Journal de Caisse)", True)
                    return data
                else:
                    self.log_test("Get Projects", False, "No featured project or Journal de Caisse found")
            else:
                self.log_test("Get Projects", False, f"Expected list with data, got: {data}")
        else:
            self.log_test("Get Projects", False, f"Status: {status}, Data: {data}")
        return []

    def test_get_projects_by_category(self):
        """Test filtering projects by category"""
        success, data, status = self.make_request('GET', '/api/projects?category=web')
        
        if success and status == 200:
            if isinstance(data, list):
                web_projects = [p for p in data if p.get('category') == 'web']
                if len(web_projects) == len(data):
                    self.log_test("Get Projects by Category (web)", True)
                    return True
                else:
                    self.log_test("Get Projects by Category", False, "Category filter not working properly")
            else:
                self.log_test("Get Projects by Category", False, f"Expected list, got: {data}")
        else:
            self.log_test("Get Projects by Category", False, f"Status: {status}, Data: {data}")
        return False

    def test_create_project(self):
        """Test creating a new project"""
        test_project = {
            "title": "Test Project",
            "description": "A test project for API testing",
            "technologies": ["Python", "FastAPI"],
            "category": "web",
            "image_url": "https://example.com/image.jpg",
            "demo_url": "https://example.com/demo",
            "github_url": "https://github.com/test/project",
            "featured": False
        }
        
        success, data, status = self.make_request('POST', '/api/projects', test_project)
        
        if success and status == 200:
            if 'message' in data and 'id' in data:
                self.log_test("Create Project", True)
                return data['id']
            else:
                self.log_test("Create Project", False, f"Unexpected response: {data}")
        else:
            self.log_test("Create Project", False, f"Status: {status}, Data: {data}")
        return None

    def test_get_single_project(self, project_id: str):
        """Test getting a single project by ID"""
        if not project_id:
            self.log_test("Get Single Project", False, "No project ID provided")
            return False
            
        success, data, status = self.make_request('GET', f'/api/projects/{project_id}')
        
        if success and status == 200:
            if data.get('id') == project_id:
                self.log_test("Get Single Project", True)
                return True
            else:
                self.log_test("Get Single Project", False, f"ID mismatch: expected {project_id}, got {data.get('id')}")
        else:
            self.log_test("Get Single Project", False, f"Status: {status}, Data: {data}")
        return False

    def test_get_skills(self):
        """Test getting all skills"""
        success, data, status = self.make_request('GET', '/api/skills')
        
        if success and status == 200:
            if isinstance(data, list) and len(data) > 0:
                # Check for expected skills
                skill_names = [s.get('name') for s in data]
                expected_skills = ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB']
                found_skills = [skill for skill in expected_skills if skill in skill_names]
                
                if len(found_skills) >= 3:
                    self.log_test("Get Skills (with expected technologies)", True)
                    return data
                else:
                    self.log_test("Get Skills", False, f"Missing expected skills. Found: {skill_names}")
            else:
                self.log_test("Get Skills", False, f"Expected list with data, got: {data}")
        else:
            self.log_test("Get Skills", False, f"Status: {status}, Data: {data}")
        return []

    def test_create_skill(self):
        """Test creating a new skill"""
        test_skill = {
            "name": "Test Skill",
            "category": "Testing",
            "level": 85,
            "icon": "🧪"
        }
        
        success, data, status = self.make_request('POST', '/api/skills', test_skill)
        
        if success and status == 200:
            if 'message' in data and 'id' in data:
                self.log_test("Create Skill", True)
                return data['id']
            else:
                self.log_test("Create Skill", False, f"Unexpected response: {data}")
        else:
            self.log_test("Create Skill", False, f"Status: {status}, Data: {data}")
        return None

    def test_get_experiences(self):
        """Test getting all experiences"""
        success, data, status = self.make_request('GET', '/api/experiences')
        
        if success and status == 200:
            if isinstance(data, list) and len(data) > 0:
                # Check for current experience
                current_experiences = [e for e in data if e.get('current', False)]
                if current_experiences:
                    self.log_test("Get Experiences (with current position)", True)
                    return data
                else:
                    self.log_test("Get Experiences", True, "No current experience found but data exists")
                    return data
            else:
                self.log_test("Get Experiences", False, f"Expected list with data, got: {data}")
        else:
            self.log_test("Get Experiences", False, f"Status: {status}, Data: {data}")
        return []

    def test_create_experience(self):
        """Test creating a new experience"""
        test_experience = {
            "company": "Test Company",
            "position": "Test Developer",
            "description": "Testing API functionality",
            "start_date": "2024-01-01T00:00:00",
            "end_date": None,
            "technologies": ["Python", "Testing"],
            "current": True
        }
        
        success, data, status = self.make_request('POST', '/api/experiences', test_experience)
        
        if success and status == 200:
            if 'message' in data and 'id' in data:
                self.log_test("Create Experience", True)
                return data['id']
            else:
                self.log_test("Create Experience", False, f"Unexpected response: {data}")
        else:
            self.log_test("Create Experience", False, f"Status: {status}, Data: {data}")
        return None

    def test_contact_form(self):
        """Test contact form submission"""
        test_contact = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "API Testing",
            "message": "This is a test message from the API test suite."
        }
        
        success, data, status = self.make_request('POST', '/api/contact', test_contact)
        
        if success and status == 200:
            if 'message' in data and 'successfully' in data['message']:
                self.log_test("Contact Form Submission", True)
                return data['id']
            else:
                self.log_test("Contact Form Submission", False, f"Unexpected response: {data}")
        else:
            self.log_test("Contact Form Submission", False, f"Status: {status}, Data: {data}")
        return None

    def test_get_contacts(self):
        """Test getting all contact messages"""
        success, data, status = self.make_request('GET', '/api/contact')
        
        if success and status == 200:
            if isinstance(data, list):
                self.log_test("Get Contact Messages", True)
                return data
            else:
                self.log_test("Get Contact Messages", False, f"Expected list, got: {data}")
        else:
            self.log_test("Get Contact Messages", False, f"Status: {status}, Data: {data}")
        return []

    def test_testimonials(self):
        """Test testimonials endpoints"""
        success, data, status = self.make_request('GET', '/api/testimonials')
        
        if success and status == 200:
            if isinstance(data, list):
                self.log_test("Get Testimonials", True)
            else:
                self.log_test("Get Testimonials", False, f"Expected list, got: {data}")
        else:
            self.log_test("Get Testimonials", False, f"Status: {status}, Data: {data}")

    def test_blog_posts(self):
        """Test blog endpoints"""
        success, data, status = self.make_request('GET', '/api/blog')
        
        if success and status == 200:
            if isinstance(data, list):
                self.log_test("Get Blog Posts", True)
            else:
                self.log_test("Get Blog Posts", False, f"Expected list, got: {data}")
        else:
            self.log_test("Get Blog Posts", False, f"Status: {status}, Data: {data}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Portfolio API Tests...")
        print(f"Testing API at: {self.base_url}")
        print("-" * 50)
        
        # Test health check first
        if not self.test_health_check():
            print("❌ API is not healthy, stopping tests")
            return False
        
        # Seed data
        self.test_seed_data()
        
        # Test projects
        projects = self.test_get_projects()
        self.test_get_projects_by_category()
        project_id = self.test_create_project()
        if project_id:
            self.test_get_single_project(project_id)
        
        # Test skills
        skills = self.test_get_skills()
        self.test_create_skill()
        
        # Test experiences
        experiences = self.test_get_experiences()
        self.test_create_experience()
        
        # Test contact
        contact_id = self.test_contact_form()
        self.test_get_contacts()
        
        # Test other endpoints
        self.test_testimonials()
        self.test_blog_posts()
        
        # Print results
        print("-" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check the details above.")
            failed_tests = [t for t in self.test_results if not t['success']]
            print("\nFailed tests:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
            return False

def main():
    """Main test function"""
    # Use the public endpoint from frontend .env
    api_url = "http://localhost:8001"  # This should be replaced with actual public URL
    
    tester = PortfolioAPITester(api_url)
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())