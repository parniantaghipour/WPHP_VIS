"""wphpProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myapp.views import get_title_people, get_table_names, get_books_by_year, home, get_publication_with_peaople, get_all_people, get_all_authors, get_publication_with_peaople, get_firms, get_one_person_timeline, get_one_firm_timeline, get_publication_with_author, get_books_by_year_genre, get_one_book, get_publication_with_firms, get_one_person_from_website, get_one_title_from_website, get_one_firm_from_website
# from wphpProject.myapp.views import get_title_people
from myapp.views import one_person_relatedfirms

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', home, name='home'),
    path('myview/', get_table_names, name='my-view'),
    path('book-title/', get_title_people, name='book-title-detail'),
    path('all-book-by-year/', get_books_by_year, name='all-book-by-yea'),
    path('get-people-pub/', get_publication_with_peaople, name='get-people-pub'),
    path('get-all-people/', get_all_people, name='get-all-people'),
    path('get-all-authors/', get_all_authors, name='get-all-authors'),
    path('get-people_with_detail/', get_publication_with_peaople,
         name='get-people_with_detail'),
    path('get-firms_with_detail/', get_publication_with_firms, name='get-firms_with_detail'),
    path('get_one_person_book/', get_one_person_timeline,
         name='get_one_person_book'),
    path('get_one_firm_book/', get_one_firm_timeline,
         name='get_one_firm_book'),
    path('get_one_type_of_people_with_books/',get_publication_with_author, 
         name='get_one_type_of_people_with_books' ),
    path('get_books_by_year_genre/',get_books_by_year_genre, 
         name='get_books_by_year_genre' ),
    path('get_one_book/',get_one_book, 
         name='get_one_book' ),
    path('get_one_person_from_website/',get_one_person_from_website, 
         name='get_one_person_from_website' ),
    path('get_one_title_from_website/',get_one_title_from_website, 
         name='get_one_title_from_website' ),
    path('get_one_firm_from_website/',get_one_firm_from_website, 
         name='get_one_firm_from_website' ),
    path('get_one_person_relatedfirms/',one_person_relatedfirms,
         name= 'get_one_person_relatedfirms')


]
