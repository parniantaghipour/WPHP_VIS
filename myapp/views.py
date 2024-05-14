from django.shortcuts import render
from itertools import groupby
# Create your views here.
from django.http import JsonResponse
from django.db import connection
from myapp.models import Role, Person, TitleRole
import requests
import json
from bs4 import BeautifulSoup


def home(request):
    return render(request, 'index.html')

def get_table_names(request):
    cursor = connection.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    table_names = [table[0] for table in tables]
    return JsonResponse({'tables': table_names})

# def get_title_people(request):
    # # title = request.GET.get('title')
    # id_n = request.GET.get('id_n')

    # title_roles = TitleRole.objects.filter(title=id_n)
    # people = []
    # for title_role in title_roles:
    #     person = Person.objects.get(id=title_role.person_id)
    #     role = Role.objects.get(id=title_role.role_id)
    #     people.append({'name': person.name, 'role': role.name})

    # return JsonResponse({'people': title_roles[0]})


def get_title_people(request):
    id_n = request.GET.get('id_n')
    
    # Use raw SQL query to get title roles for given ID
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM title_role WHERE title_id=%s", [id_n])
        title_roles = cursor.fetchall()
    
    people = []
    for title_role in title_roles:
        # Use raw SQL query to get person and role for each title role
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM person WHERE id=%s", [title_role[3]])
            person = cursor.fetchone()
            cursor.execute("SELECT * FROM role WHERE id=%s", [title_role[2]])
            role = cursor.fetchone()
        
        # Append person and role information to people list
        people.append({'name': person[1], 'role': role[1]})

    return JsonResponse({'people': people})



def get_books_by_year(request):
    start_year = request.GET.get('start_year')
    end_year = request.GET.get('end_year')

    if start_year is None or end_year is None:
        return JsonResponse({'error': 'Both start_year and end_year parameters are required.'}, status=400)

    with connection.cursor() as cursor:
        cursor.execute("SELECT DISTINCT pubdate FROM title")
        years = cursor.fetchall()

        books_by_year = []
        for year in years:
            if year[0] == None:
                cursor.execute("SELECT * FROM title WHERE pubdate IS NULL OR pubdate=''")
                books = cursor.fetchall()
                books_by_year.append({'year': "empty", 'books': books, 'size': len(books)})
            elif year[0] >= start_year and year[0] <= end_year:
                cursor.execute("SELECT * FROM title WHERE pubdate=%s", [year[0]])
                books = cursor.fetchall()   
                books_by_year.append({'year': year[0], 'books': books, 'size': len(books)})

    return JsonResponse({'books_by_year': books_by_year})


def get_books_by_year_genre(request):
    # start_year = request.GET.get('start_year')
    # end_year = request.GET.get('end_year')
    genre_id = request.GET.get('genre_id')
    role_id = request.GET.get('role_id')
    gender_id = request.GET.get('gender')
    gender_value = ""
    if gender_id == "1":
        gender_value = "F"
    elif gender_id == "2":
        gender_value = "M"
    elif gender_id == "3":
        gender_value = "U"

    firm_role_id = request.GET.get('firm_role_id')
    # if start_year is None or end_year is None:
    #     return JsonResponse({'error': 'Both start_year and end_year parameters are required.'}, status=400)
    with connection.cursor() as cursor:
        if genre_id == '0':
            cursor.execute("SELECT * FROM title")
        else:
            cursor.execute("SELECT title.* FROM title JOIN title_genre ON title.id = title_genre.title_id WHERE title_genre.genre_id = %s", [genre_id])
        
        books = cursor.fetchall()


        books_by_year = {}
        for book in books:
            year = book[7]  # Assuming publish year is at index 8 in the book tuple
            if year == "" or year =="empty" or year== "null" or year == None:  
                year = ""
            if year not in books_by_year:
                books_by_year[year] = {'books': [], 'firms_start_dates': [], 'people_involved_first_work':[]}
            books_by_year[year]['books'].append(book)

            # Extract firm start dates for each book
            title_id = book[0]  # Assuming title_id is at index 0 in the book tuple
            if firm_role_id == "0":
                cursor.execute("SELECT firm_id FROM title_firmrole WHERE title_id=%s", [title_id])
            else:
                cursor.execute("SELECT firm_id FROM title_firmrole WHERE title_id=%s AND firmrole_id=%s", [title_id, firm_role_id])

            firm_ids = cursor.fetchall()

            # Get firm start dates and add them to the list
            for firm_id in firm_ids:
                cursor.execute("SELECT start_date FROM firm WHERE id=%s", [firm_id[0]])
                firm_start_date = cursor.fetchone()
                if firm_start_date:
                    books_by_year[year]['firms_start_dates'].append(firm_start_date[0])
            # Extract people start dates for each book
            if role_id == "0":
                cursor.execute("SELECT person_id FROM title_role WHERE title_id=%s", [title_id])
            else:
                cursor.execute("SELECT person_id FROM title_role WHERE title_id=%s AND role_id=%s", [title_id, role_id])

            person_ids = cursor.fetchall()
            # print("person_ids", person_ids)
            # Get firm start dates and add them to the list

            if gender_id != "0":
                for person_id in person_ids:
                    cursor.execute("SELECT first_work FROM person WHERE id=%s AND gender=%s", [person_id[0], gender_value])
                    first_work_date = cursor.fetchone()
                    if first_work_date:
                        books_by_year[year]['people_involved_first_work'].append(first_work_date[0])
            if gender_id == "0":
                for person_id in person_ids:
                    cursor.execute("SELECT first_work FROM person WHERE id=%s", [person_id[0]])
                    first_work_date = cursor.fetchone()
                    if first_work_date:
                        books_by_year[year]['people_involved_first_work'].append(first_work_date[0])

        # Create array of objects with year, books, size, and firm start dates distribution for each year
        result = []
        for year, book_data in books_by_year.items():
            book_data['size'] = len(book_data['books'])
            start_dates_distribution = {}
            people_start_dates_distribution = {}
            # Calculate the distribution of firm start dates
            for start_date in book_data['firms_start_dates']:
                if start_date not in start_dates_distribution:
                    start_dates_distribution[start_date] = 0
                start_dates_distribution[start_date] += 1

            book_data['firms_start_dates'] = [{'start_date': start_date, 'count': count} for start_date, count in start_dates_distribution.items()]

            for start_work_date in book_data['people_involved_first_work']:
                if start_work_date not in people_start_dates_distribution:
                    people_start_dates_distribution[start_work_date] = 0
                people_start_dates_distribution[start_work_date] += 1

            book_data['people_involved_first_work'] = [{'start_work_date': start_work_date, 'count': count} for start_work_date, count in people_start_dates_distribution.items()]

            result.append({'year': year, 'books': book_data['books'], 'size': book_data['size'], 'firms_start_dates': book_data['firms_start_dates'], 'people_start_dates': book_data['people_involved_first_work']})

        return JsonResponse({'books_by_year': result})

    #             books_by_year.append({'year': year[0], 'books': books, 'size': len(books)})

    # return JsonResponse({'books_by_year': result})
def get_publication_with_peaople(request): 
    first_name_n = request.GET.get('first_name_n')
    with connection.cursor() as cursor:
        people_with_book = []
        cursor.execute("SELECT id FROM person WHERE first_name=%s", [first_name_n])
        all_people = cursor.fetchall()
        for people in all_people:
            cursor.execute("SELECT * FROM title_role WHERE person_id=%s", [people])
            all_contribution = cursor.fetchall()
            books =[]
            for contribution in all_contribution:
                cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
                books.append(cursor.fetchone())
            people_with_book.append({'people_id': people[0], 'books':books})

        return JsonResponse({'people_with_book': people_with_book})
    


def get_all_people(request):
    with connection.cursor() as cursor:
        all_people = []
        cursor.execute("SELECT * FROM person")
        all_people= cursor.fetchall()

    return  JsonResponse({'all_people': all_people})



def get_all_authors(request):
    with connection.cursor() as cursor:
        all_authors = []
        cursor.execute("SELECT * FROM title_role WHERE role_id=1")
        all_titles_authors= cursor.fetchall()
        unique_id = set(d[3] for d in all_titles_authors)
        for id in unique_id:
            cursor.execute("SELECT * FROM person WHERE id=%s", [id])
            all_authors.append(cursor.fetchone())
    return  JsonResponse({'all_authors': all_authors })



def get_publication_with_peaople(request): 
    with connection.cursor() as cursor:
        people_with_book = []
        cursor.execute("SELECT * FROM person")
        all_people = cursor.fetchall()
        for people in all_people:
            cursor.execute("SELECT * FROM title_role WHERE person_id=%s", [people[0]])
            all_contribution = cursor.fetchall()
            if len(all_contribution) >=1:
                books =[]

                for contribution in all_contribution:
                    cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
                    book = cursor.fetchone()
                    if book != None:
                        books.append(book)
                is_NULL = 0
                min_date= "2000"
                book_year= []
                for book in books:
                    book_year.append(book[7])
                    if book[7] == None or book[7] == "":
                        is_NULL = 1
                    elif book[7]< min_date:
                        min_date = book[7]  
                if min_date == "2000":
                    min_date =""
                # book_year.sort()
                people_with_book.append({'people_id': people[0], 'people_name':people[2], 'people_LName': people[1], "books": books, 'min_date': min_date, 'has_NULL': is_NULL, 'working_years': book_year})
            
            people_with_book.sort(key=lambda x: x['min_date'])
            people_in_groups = groupby(people_with_book, lambda x: x['min_date'])
            groups = []
            for key, group in people_in_groups:
                listcheck = list(group)
                working_years_all=[]
                for x in listcheck:
                    working_years_all = working_years_all + x['working_years']
                
                value_counts ={}
                for value in working_years_all:
                    if value in value_counts:
                        value_counts[value] += 1
                    else:
                        value_counts[value] = 1

                groups.append({"year":key, "size":len(listcheck), "value_counts":value_counts
                               ,"people": listcheck
                                })
            # groups = [(key, list(group), len(list(group))) for key, group in itertools.groupby(people_with_book, lambda x: x['min_date'])]
     

        return JsonResponse({'people_with_book': groups})
    
def get_publication_with_author(request):
    gender = request.GET.get('gender')# 0: not selected, 1: female, 2: male, 3: Undefined
    book_genre = request.GET.get('genre_id')
    job_id  = request.GET.get('job_id')        
    with connection.cursor() as cursor:
        title_with_genre =[]
        if book_genre != 0:
            cursor.execute("SELECT title_id FROM title_genre WHERE genre_id=%s", [book_genre])
            result_format = cursor.fetchall()
            title_with_genre = [row[0] for row in result_format]

             
        people_with_book = []
        Unknown_people = []
        if job_id == "0":
            cursor.execute("SELECT * FROM title_role")
        else:
            cursor.execute("SELECT * FROM title_role WHERE role_id=%s", [job_id])
        all_titles_authors= cursor.fetchall()
        unique_id = set(d[3] for d in all_titles_authors)
        for id in unique_id:
            cursor.execute("SELECT * FROM person WHERE id=%s", [id])
            person = cursor.fetchone()
            if (gender != "0" and (gender == "1" and person[4] =="F") or (gender == "2" and person[4] =="M") or (gender == "3" and person[4] =="U")) or (gender == "0"): 
                cursor.execute("SELECT * FROM title_role WHERE person_id=%s", [id])
                all_contribution = cursor.fetchall()
                if len(all_contribution) >=1:
                    books =[]

                    for contribution in all_contribution:
                        if book_genre == "0" or (contribution[1] in title_with_genre ):
                            cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
                            book = cursor.fetchone()
                            if book != None:
                                books.append(book)
                    if books != []:            
                        is_NULL = 0
                        min_date= "2000"
                        book_year= []
                        for book in books:
                            book_year.append(book[7])
                            if book[7] == None or book[7] == "" or book[7] == "null" or book[7] == "0000" or book[7]=="empty":
                                is_NULL = 1
                            elif book[7]< min_date:
                                min_date = book[7]  
                        if min_date == "2000":
                            min_date =""
                        # book_year.sort()
                        if person[1] == "Unknown":
                            Unknown_people.append({'people_id': person[0], 'people_name':person[2], 'people_LName': person[1], "books": books, 'min_date': min_date, 'has_NULL': is_NULL, 'working_years': book_year, "person":person, "len": len(books)})
                        else: 
                            if person[1]!= None:
                                people_with_book.append({'people_id': person[0], 'people_name':person[2], 'people_LName': person[1], "books": books, 'min_date': min_date, 'has_NULL': is_NULL, 'working_years': book_year, "person":person})
                            else:
                                people_with_book.append({'people_id': person[0], 'people_name':person[2], 'people_LName': ' ', "books": books, 'min_date': min_date, 'has_NULL': is_NULL, 'working_years': book_year, "person":person})

        people_with_book.sort(key=lambda x: x['people_LName'])
        people_with_book.sort(key=lambda x: x['min_date'])
        people_in_groups = groupby(people_with_book, lambda x: x['min_date'])
        groups = []
        for key, group in people_in_groups:
            listcheck = list(group)
            working_years_all=[]
            for x in listcheck:
                working_years_all = working_years_all + x['working_years']
            
            value_counts ={}
            for value in working_years_all:
                if value in value_counts:
                    value_counts[value] += 1
                else:
                    value_counts[value] = 1

            groups.append({"year":key, "size":len(listcheck), "value_counts":value_counts
                            ,"people": listcheck
                            })
            
        # groups = [(key, list(group), len(list(group))) for key, group in itertools.groupby(people_with_book, lambda x: x['min_date'])]
    
    return JsonResponse({'people_with_book': groups, 'Unknown': Unknown_people})

def get_firms(request):
    firm_role = request.GET.get('firm_role')
    with connection.cursor() as cursor:
        firm_with_book = []
        cursor.execute("SELECT * FROM firm")
        firms = cursor.fetchall()
        for firm in firms:
            if firm_role == '0':
                cursor.execute("SELECT * FROM title_firmrole WHERE firm_id=%s", [firm[0]])
            else:
                cursor.execute("SELECT * FROM title_firmrole WHERE firm_id=%s AND firmrole_id=%s", [firm[0], firm_role])
            all_contribution = cursor.fetchall()
            start_Date = "1600"
            if firm[4] != None:
                start_Date = firm[4]
            if len(all_contribution) >=1:
                books =[]
                for contribution in all_contribution:
                    cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
                    book = cursor.fetchone()
                    if book != None:
                        books.append(book)
                # is_NULL = 0
                min_date= "2000"
                book_year= []
                for book in books:
                    book_year.append(book[7])
                #     if book[7] == None or book[7] == "":
                #         is_NULL = 1
                #     elif book[7]< min_date:
                #         min_date = book[7]  
                if min_date == "2000":
                    min_date =""
                # book_year.sort()
                #'has_NULL': is_NULL,
                firm_with_book.append({'fullinformationfirm':firm,'firm_id': firm[0],'firm': firm[1], 'min_date': start_Date, 'working_years': book_year, "books": books})
            
            firm_with_book.sort(key=lambda x: x['min_date'])
            people_in_groups = groupby(firm_with_book, lambda x: x['min_date'])
            groups = []
            for key, group in people_in_groups:
                listcheck = list(group)
                working_years_all=[]
                for x in listcheck:
                    working_years_all = working_years_all + x['working_years']
                
                value_counts ={}
                for value in working_years_all:
                    if value in value_counts:
                        value_counts[value] += 1
                    else:
                        value_counts[value] = 1

                groups.append({"year":key, "size":len(listcheck), "value_counts":value_counts
                               ,"firms": listcheck
                                })
            # groups = [(key, list(group), len(list(group))) for key, group in itertools.groupby(people_with_book, lambda x: x['min_date'])]
     

        return JsonResponse({'firms_with_book': groups})


def get_one_person_timeline(request):
    id = request.GET.get('id_n')
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM title_role WHERE person_id=%s", [id])
        all_contribution = cursor.fetchall()
        if len(all_contribution) >=0:
            books_role =[]
            for contribution in all_contribution:
                cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
                book = cursor.fetchone()
                if book != None:
                    if book[7] == None or book[7] == "":
                        book = book[:7] + (" ",) + book[8:]

                    books_role.append({ 'book': book, 
                                        'role': contribution[2]})
            # is_NULL = 0
            # min_date= "2000"
            # book_year= []
            # for item in books_role:
            #     book_year.append(item['book'][7])
            #     if item['book'][7] == None or item['book'][7] == "":
            #         is_NULL = 1
            #     elif item['book'][7]< min_date:
            #         min_date = book[7]  
            # if min_date == "2000":
            #     min_date =""
            # book_year.sort()
            # print(books_role)
            books_role.sort(key=lambda x: x['book'][7])
            max_value = max(books_role, key=lambda x: x['book'][7])['book'][7]

            books_in_groups = groupby(books_role, lambda x: x['book'][7])
            groups = []
            for year, books in books_in_groups:
                bookList = list(books) 
                groups.append({"year": year, "bookList": bookList, "size": len(bookList), "person_id": id})
            # print(groups)
        
            return JsonResponse({'person_books': groups, 'max_value':max_value})   
        


def get_one_firm_timeline(request):
    id = request.GET.get('id_n')
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM title_firmrole WHERE firm_id=%s", [id])
        all_contribution = cursor.fetchall()
        if len(all_contribution) >=0:
            books_role =[]
            for contribution in all_contribution:
                cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
                book = cursor.fetchone()
                if book != None:
                    if book[7] == None or book[7] == "":
                        book = book[:7] + (" ",) + book[8:]
                    books_role.append({ 'book': book, 
                                        'role': contribution[2]})
            # is_NULL = 0
            # min_date= "2000"
            # book_year= []
            # for item in books_role:
            #     book_year.append(item['book'][7])
            #     if item['book'][7] == None or item['book'][7] == "":
            #         is_NULL = 1
            #     elif item['book'][7]< min_date:
            #         min_date = book[7]  
            # if min_date == "2000":
            #     min_date =""
            # book_year.sort()
            # print(books_role)
            books_role.sort(key=lambda x: x['book'][7])
            books_in_groups = groupby(books_role, lambda x: x['book'][7])
            max_value = max(books_role, key=lambda x: x['book'][7])['book'][7]
            min_value = min(books_role, key=lambda x: x['book'][7])['book'][7]


            groups = []
            for year, books in books_in_groups:
                bookList = list(books) 
                groups.append({"year": year, "bookList": bookList, "size": len(bookList)})
            # print(groups)
        
            return JsonResponse({'firm_books': groups, 'max_value':max_value, 'min_value':min_value})   




def get_one_book(request):
    id_n = request.GET.get('id_n')
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM title WHERE id=%s", [id_n])
        book = cursor.fetchone()
        cursor.execute("SELECT * FROM title_firmrole WHERE title_id=%s", [id_n])
        all_firm_contribution = cursor.fetchall()
        firm_role =[]

        if len(all_firm_contribution) >=0:
            for contribution in all_firm_contribution:
                cursor.execute("SELECT * FROM firm WHERE id=%s", [contribution[3]] )
                firm = cursor.fetchone()
                if firm != None:
                    if firm[4] == None or firm[4] == "":
                        firm = firm[:4] + (" ",) + firm[5:]
                    firm_role.append({ 'firm': firm, 
                                        'role': contribution[2]})
        firm_role.sort(key=lambda x: x['firm'][4])
        # max_value_firm = max(firm_role, key=lambda x: x['firm'][4])['firm'][4]

        firms_in_groups = groupby(firm_role, lambda x: x['firm'][4])
        firmgroups = []
        for year, firms in firms_in_groups:
            firmList = list(firms) 
            firmgroups.append({"year": year, "firmList": firmList, "size": len(firmList)})
            # print(groups)
                            
        cursor.execute("SELECT * FROM title_role WHERE title_id=%s", [id_n])
        all_people_contribution = cursor.fetchall()
        people_role =[]

        if len(all_people_contribution) >=0:
            for contribution in all_people_contribution:
                cursor.execute("SELECT * FROM person WHERE id=%s", [contribution[3]] )
                person = cursor.fetchone()

                if person != None:
                    if person[16] == None or person[16] == "":
                        person = person[:16] + (" ",) + person[17:]
                    people_role.append({ 'person': person, 
                                        'role': contribution[2]})
        
        people_role.sort(key=lambda x: x['person'][16])
        # max_value_firm = max(firm_role, key=lambda x: x['firm'][4])['firm'][4]

        persons_in_groups = groupby(people_role, lambda x: x['person'][16])
        persongroups = []
        for year, persons in persons_in_groups:
            personList = list(persons) 
            persongroups.append({"year": year, "personList": personList, "size": len(personList)})
            
            # books_in_groups = groupby(books_role, lambda x: x['book'][7])
            # groups = []
            # for year, books in books_in_groups:
            #     bookList = list(books) 
            #     groups.append({"year": year, "bookList": bookList, "size": len(bookList)})
            # print(groups)
        
        return JsonResponse({'book': book, "firm_roles": firmgroups, "people_role":persongroups})
# def get_publication_with_peaople(request): 
    # with connection.cursor() as cursor:
    #     people_with_book = []
    #     cursor.execute("SELECT id FROM person")
    #     all_people = cursor.fetchall()
    #     for people in all_people:
    #         cursor.execute("SELECT * FROM title_role WHERE person_id=%s", [people])
    #         all_contribution = cursor.fetchall()
    #         if len(all_contribution) >=1:
    #             books =[]

    #             for contribution in all_contribution:
    #                 cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
    #                 book = cursor.fetchone()
    #                 if book != None:
    #                     books.append(book)
    #             is_NULL = 0
    #             min_date= "3000"
    #             for book in books:
    #                 if book[7] == None:
    #                     is_NULL = 1
    #                 elif book[7]< min_date:
    #                     min_date = book[7]  

    #             people_with_book.append({'people_id': people[0], "books": books, 'min_date': min_date, 'has_NULL': is_NULL})
            
    #         people_with_book.sort(key=lambda x: x['min_date'])
    #         people_in_groups = groupby(people_with_book, lambda x: x['min_date'])
    #         groups = []
    #         for key, group in people_in_groups:
    #             listcheck = list(group)
    #             groups.append({"year":key, "size":len(listcheck)
    #                         #    ,"people": listcheck
    #                             })
    #         # groups = [(key, list(group), len(list(group))) for key, group in itertools.groupby(people_with_book, lambda x: x['min_date'])]
     

    #     return JsonResponse({'people_with_book': groups})
def get_publication_with_firms(request):
    book_genre = request.GET.get('genre_id')
    job_id  = request.GET.get('job_id')
    with connection.cursor() as cursor:
        title_with_genre =[]
        if book_genre != 0:
            cursor.execute("SELECT title_id FROM title_genre WHERE genre_id=%s", [book_genre])
            result_format = cursor.fetchall()
            title_with_genre = [row[0] for row in result_format]
            
        firm_with_book = []
        if job_id == "0":
            cursor.execute("SELECT * FROM title_firmrole")
        else:
            cursor.execute("SELECT * FROM title_firmrole WHERE firmrole_id=%s", [job_id])
        all_titles_firms= cursor.fetchall()
        unique_id = set(d[3] for d in all_titles_firms)
        print("len", len(unique_id))
        for id in unique_id:
            cursor.execute("SELECT * FROM firm WHERE id=%s", [id])
            firm = cursor.fetchone()
            cursor.execute("SELECT * FROM title_firmrole WHERE firm_id=%s", [id])
            all_contribution = cursor.fetchall()
            start_Date = "1600"
            if firm != None:
                if firm[4] != None:
                    start_Date = firm[4]
                if len(all_contribution) >=1:
                    books =[]

                    for contribution in all_contribution:
                        if book_genre == "0" or (contribution[1] in title_with_genre ):
                            cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
                            book = cursor.fetchone()
                            if book != None:
                                books.append(book)
                    if books != []:            
                        is_NULL = 0
                        min_date= "2000"
                        book_year= []
                        for book in books:
                            book_year.append(book[7])
                            if book[7] == None or book[7] == "" or book[7] == "null" or book[7] == "0000" or book[7]=="empty":
                                is_NULL = 1
                            elif book[7]< min_date:
                                min_date = book[7]  
                        if min_date == "2000":
                            min_date =""
                        # book_year.sort()
                        # firm_with_book.append({'people_id': person[0], 'people_name':person[2], 'people_LName': person[1], "books": books, 'min_date': min_date, 'has_NULL': is_NULL, 'working_years': book_year, "person":person})
                        firm_with_book.append({'fullinformationfirm':firm,'firm_id': firm[0],'firm': firm[1], 'min_date': start_Date, 'working_years': book_year, "books": books})

        firm_with_book.sort(key=lambda x: x['min_date'])
        people_in_groups = groupby(firm_with_book, lambda x: x['min_date'])
        groups = []
        for key, group in people_in_groups:
            listcheck = list(group)
            working_years_all=[]
            for x in listcheck:
                working_years_all = working_years_all + x['working_years']
            
            value_counts ={}
            for value in working_years_all:
                if value in value_counts:
                    value_counts[value] += 1
                else:
                    value_counts[value] = 1

            groups.append({"year":key, "size":len(listcheck), "value_counts":value_counts
                            ,"firms": listcheck
                            })
        # groups = [(key, list(group), len(list(group))) for key, group in itertools.groupby(people_with_book, lambda x: x['min_date'])]
    

    return JsonResponse({'firms_with_book': groups})

def get_one_person_from_website(request):
    person_id = request.GET.get('id_n')

    url = "https://womensprinthistoryproject.com/person/" + person_id

    response = requests.get(url)
    # if response.status_code == 200:
        # print(response.text)
    # data = response.json()
    soup = BeautifulSoup(response.text, 'html.parser')

# Extracting the person's name
    # name = soup.find('div', class_='main-col').find('strong').text.strip()
    # person_name = soup.find('div', class_='page-header').h1.text.strip()
    # print('Person Name:', soup.find('div', class_='main-col'))

    # Extracting the person's details
    # print(soup.find('pre', id='apibrowser_json'))

    details_table = soup.find('div', class_='person-meta').find('table')
    details_rows = details_table.find_all('tr')
    person_details = {}
    for row in details_rows:
        key = row.th.text.strip()
        value = row.td.text.strip()
        person_details[key] = value
    dic = []
    for key, value in person_details.items():
        dic.append({key : value})
    return JsonResponse({'result': dic})

    # result = {
    #     "ID": data["person"]["id"],
    #     "Last Name": data["person"]["last_name"],
    #     "First Name": data["person"]["first_name"],
    #     "Title": data["person"]["title"],
    #     "Gender": data["person"]["gender"],
    #     "Date of Birth": data["person"]["date_of_birth"],
    #     "Date of Death": data["person"]["date_of_death"],
    #     "Place of Birth": data["person"]["place_of_birth"],
    #     "Place of Death": data["person"]["place_of_death"],
    #     "VIAF URI": data["person"]["viaf_uri"],
    #     "Wikipedia Entry": data["person"]["wikipedia_entry"],
    #     "Image URL": data["person"]["image"],
    #     "Notes": ""
    # }

    # Convert the result dictionary to JSON format
    # print(result)
def get_one_title_from_website(request):
    title_id = request.GET.get('id_n')

    # url = "https://womensprinthistoryproject.com/person/" + person_id
    url = "https://womensprinthistoryproject.com/title/" + title_id


    response = requests.get(url)
    # if response.status_code == 200:
        # print(response.text)
    # data = response.json()
    soup = BeautifulSoup(response.text, 'html.parser')

# Extracting the person's name
    # name = soup.find('div', class_='main-col').find('strong').text.strip()
    # person_name = soup.find('div', class_='page-header').h1.text.strip()
    # print('Person Name:', soup.find('div', class_='main-col'))

    # Extracting the person's details
    # print(soup.find('pre', id='apibrowser_json'))
    details_table = soup.find('div', class_='title-metadata title-metadata-main').find('table')
    second_details_table = soup.find('div', class_='title-metadata title-metadata-bibliographic').find('table')
    details_rows = details_table.find_all('tr')
    second_details_rows = second_details_table.find_all('tr')

    person_details = {}
    for row in details_rows:
        key = row.th.text.strip()
        value = row.td.text.strip()
        person_details[key] = value
    for row in second_details_rows:
        key = row.th.text.strip()
        value = row.td.text.strip()
        person_details[key] = value
    
    dic = []

    for key, value in person_details.items():
        dic.append({key : value})
    return JsonResponse({'result': dic})


def get_one_firm_from_website(request):

    firm_id = request.GET.get('id_n')

    url = "https://womensprinthistoryproject.com/firm/" + firm_id

    response = requests.get(url)
    # if response.status_code == 200:
        # print(response.text)
    # data = response.json()
    soup = BeautifulSoup(response.text, 'html.parser')

# Extracting the person's name
    # name = soup.find('div', class_='main-col').find('strong').text.strip()
    # person_name = soup.find('div', class_='page-header').h1.text.strip()
    # print('Person Name:', soup.find('div', class_='main-col'))

    # Extracting the person's details
    # print(soup.find('pre', id='apibrowser_json'))

    details_table = soup.find('div', class_='tbl-container htable').find('table')
    details_rows = details_table.find_all('tr')
    person_details = {}
    for row in details_rows:
        key = row.th.text.strip()
        value = row.td.text.strip()
        person_details[key] = value
    dic = []
    for key, value in person_details.items():
        dic.append({key : value})
    return JsonResponse({'result': dic})



def one_person_relatedfirms(request):
    person_id = request.GET.get('id_n')

    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM title_role WHERE person_id=%s", [person_id])
        all_contribution = cursor.fetchall()
        if len(all_contribution) >=0:
            books_role =[]
            for contribution in all_contribution:
                cursor.execute("SELECT * FROM title WHERE id=%s", [contribution[1]] )
                book = cursor.fetchone()
                if book != None:
                    if book[7] == None or book[7] == "":
                        book = book[:7] + (" ",) + book[8:]
                    cursor.execute("SELECT * FROM title_firmrole WHERE title_id=%s", [book[0]])
                    firm_contributors_for_one_book= cursor.fetchall()
                    for firm_contributor_for_one_book in firm_contributors_for_one_book:
                        cursor.execute("SELECT * FROM firm WHERE id=%s", [firm_contributor_for_one_book[3]])
                        firm = cursor.fetchone()
                        books_role.append({ 'book': book,
                                         'year':book[7], 
                                        'role': firm_contributor_for_one_book[2],
                                        'firm': firm,
                                        'firm_id': firm[0]})
            # is_NULL = 0
            # min_date= "2000"
            # book_year= []
            # for item in books_role:
            #     book_year.append(item['book'][7])
            #     if item['book'][7] == None or item['book'][7] == "":
            #         is_NULL = 1
            #     elif item['book'][7]< min_date:
            #         min_date = book[7]  
            # if min_date == "2000":
            #     min_date =""
            # book_year.sort()
            # print(books_role)
            books_role.sort(key=lambda x: x['year'])
            max_value = max(books_role, key=lambda x: x['year'])['year']
            min_value = min((book['year'] for book in books_role if book['year'] != ""), default=None)



            books_in_groups = groupby(books_role, lambda x: x['firm_id'])
            groups = []
            for firm_id, books in books_in_groups:
                bookList = list(books) 
                groups.append({"firm_id": firm_id, "bookList": bookList, "size": len(bookList)})
            # print(groups)
            groups.sort(key=lambda x: x['size'])
            return JsonResponse({'person_books': groups, 'min_value': min_value, 'max_value': max_value, "firm_number": len(groups)})