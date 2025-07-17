from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

app = FastAPI(title="Portfolio BEZARA Kemuel API", version="1.0.0")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connexion MongoDB
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.portfolio_kemuel

# Collections
projects_collection = db.projects
skills_collection = db.skills
experiences_collection = db.experiences
testimonials_collection = db.testimonials
blog_collection = db.blog
contacts_collection = db.contacts

# Models Pydantic
class Project(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    technologies: List[str]
    category: str
    image_url: str
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool = False
    date_created: datetime = datetime.now()

class Skill(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    level: int  # 1-100
    icon: str

class Experience(BaseModel):
    id: Optional[str] = None
    company: str
    position: str
    description: str
    start_date: datetime
    end_date: Optional[datetime] = None
    technologies: List[str]
    current: bool = False

class Testimonial(BaseModel):
    id: Optional[str] = None
    name: str
    company: str
    position: str
    content: str
    rating: int  # 1-5
    avatar_url: str

class BlogPost(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    summary: str
    tags: List[str]
    image_url: str
    published: bool = False
    date_created: datetime = datetime.now()

class Contact(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    subject: str
    message: str
    date_created: datetime = datetime.now()

# Routes API

# Projects
@app.get("/api/projects")
async def get_projects(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    
    projects = list(projects_collection.find(query))
    for project in projects:
        project["_id"] = str(project["_id"])
    return projects

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    project = projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project["_id"] = str(project["_id"])
    return project

@app.post("/api/projects")
async def create_project(project: Project):
    project.id = str(uuid.uuid4())
    project_dict = project.dict()
    projects_collection.insert_one(project_dict)
    return {"message": "Project created successfully", "id": project.id}

# Skills
@app.get("/api/skills")
async def get_skills():
    skills = list(skills_collection.find())
    for skill in skills:
        skill["_id"] = str(skill["_id"])
    return skills

@app.post("/api/skills")
async def create_skill(skill: Skill):
    skill.id = str(uuid.uuid4())
    skill_dict = skill.dict()
    skills_collection.insert_one(skill_dict)
    return {"message": "Skill created successfully", "id": skill.id}

# Experiences
@app.get("/api/experiences")
async def get_experiences():
    experiences = list(experiences_collection.find().sort("start_date", -1))
    for experience in experiences:
        experience["_id"] = str(experience["_id"])
    return experiences

@app.post("/api/experiences")
async def create_experience(experience: Experience):
    experience.id = str(uuid.uuid4())
    experience_dict = experience.dict()
    experiences_collection.insert_one(experience_dict)
    return {"message": "Experience created successfully", "id": experience.id}

# Testimonials
@app.get("/api/testimonials")
async def get_testimonials():
    testimonials = list(testimonials_collection.find())
    for testimonial in testimonials:
        testimonial["_id"] = str(testimonial["_id"])
    return testimonials

@app.post("/api/testimonials")
async def create_testimonial(testimonial: Testimonial):
    testimonial.id = str(uuid.uuid4())
    testimonial_dict = testimonial.dict()
    testimonials_collection.insert_one(testimonial_dict)
    return {"message": "Testimonial created successfully", "id": testimonial.id}

# Blog
@app.get("/api/blog")
async def get_blog_posts():
    posts = list(blog_collection.find({"published": True}).sort("date_created", -1))
    for post in posts:
        post["_id"] = str(post["_id"])
    return posts

@app.get("/api/blog/{post_id}")
async def get_blog_post(post_id: str):
    post = blog_collection.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    post["_id"] = str(post["_id"])
    return post

@app.post("/api/blog")
async def create_blog_post(post: BlogPost):
    post.id = str(uuid.uuid4())
    post_dict = post.dict()
    blog_collection.insert_one(post_dict)
    return {"message": "Blog post created successfully", "id": post.id}

# Contact
@app.post("/api/contact")
async def create_contact(contact: Contact):
    contact.id = str(uuid.uuid4())
    contact_dict = contact.dict()
    contacts_collection.insert_one(contact_dict)
    return {"message": "Message sent successfully", "id": contact.id}

@app.get("/api/contact")
async def get_contacts():
    contacts = list(contacts_collection.find().sort("date_created", -1))
    for contact in contacts:
        contact["_id"] = str(contact["_id"])
    return contacts

# Route de test
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Portfolio API is running"}

# Données de démonstration
@app.post("/api/seed-data")
async def seed_data():
    # Projets
    sample_projects = [
        {
            "id": str(uuid.uuid4()),
            "title": "Application Journal de Caisse",
            "description": "Application complète de gestion de journal de caisse avec suivi des transactions, rapports détaillés et interface intuitive pour les commerces.",
            "technologies": ["React", "Node.js", "MongoDB", "Express"],
            "category": "web",
            "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            "demo_url": "https://demo.journalcaisse.com",
            "github_url": "https://github.com/bezkemuel/journal-caisse",
            "featured": True,
            "date_created": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Système de Gestion Réseau",
            "description": "Outil d'administration réseau permettant la surveillance, configuration et maintenance des infrastructures informatiques.",
            "technologies": ["Python", "Docker", "Linux", "Nginx"],
            "category": "network",
            "image_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            "demo_url": None,
            "github_url": "https://github.com/bezkemuel/network-admin",
            "featured": False,
            "date_created": datetime.now()
        }
    ]
    
    # Skills
    sample_skills = [
        {"id": str(uuid.uuid4()), "name": "JavaScript", "category": "Frontend", "level": 90, "icon": "⚡"},
        {"id": str(uuid.uuid4()), "name": "React", "category": "Frontend", "level": 85, "icon": "⚛️"},
        {"id": str(uuid.uuid4()), "name": "Node.js", "category": "Backend", "level": 80, "icon": "🟢"},
        {"id": str(uuid.uuid4()), "name": "MongoDB", "category": "Database", "level": 75, "icon": "🍃"},
        {"id": str(uuid.uuid4()), "name": "Linux", "category": "System", "level": 85, "icon": "🐧"},
        {"id": str(uuid.uuid4()), "name": "Docker", "category": "DevOps", "level": 70, "icon": "🐳"},
        {"id": str(uuid.uuid4()), "name": "Nginx", "category": "Network", "level": 80, "icon": "🌐"},
        {"id": str(uuid.uuid4()), "name": "Python", "category": "Backend", "level": 75, "icon": "🐍"}
    ]
    
    # Experiences
    sample_experiences = [
        {
            "id": str(uuid.uuid4()),
            "company": "Tech Solutions Inc.",
            "position": "Développeur Full Stack",
            "description": "Développement d'applications web modernes et maintenance des systèmes réseau de l'entreprise.",
            "start_date": datetime(2023, 1, 15),
            "end_date": None,
            "technologies": ["React", "Node.js", "MongoDB", "Linux"],
            "current": True
        },
        {
            "id": str(uuid.uuid4()),
            "company": "Digital Network Corp.",
            "position": "Administrateur Réseau",
            "description": "Gestion et maintenance de l'infrastructure réseau, configuration des serveurs et sécurité informatique.",
            "start_date": datetime(2022, 3, 1),
            "end_date": datetime(2022, 12, 31),
            "technologies": ["Linux", "Nginx", "Docker", "Python"],
            "current": False
        }
    ]
    
    # Insérer les données
    projects_collection.delete_many({})
    skills_collection.delete_many({})
    experiences_collection.delete_many({})
    
    projects_collection.insert_many(sample_projects)
    skills_collection.insert_many(sample_skills)
    experiences_collection.insert_many(sample_experiences)
    
    return {"message": "Sample data seeded successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)