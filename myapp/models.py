from django.db import models

class Geonames(models.Model):
    geonameid = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200, null=True)
    asciiname = models.CharField(max_length=200, null=True)
    alternatenames = models.CharField(max_length=4000, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True)
    fclass = models.CharField(max_length=1, null=True)
    fcode = models.CharField(max_length=10, null=True)
    country = models.CharField(max_length=2, null=True)
    cc2 = models.CharField(max_length=60, null=True)
    admin1 = models.CharField(max_length=20, null=True)
    admin2 = models.CharField(max_length=80, null=True)
    admin3 = models.CharField(max_length=20, null=True)
    admin4 = models.CharField(max_length=20, null=True)
    population = models.IntegerField(null=True)
    elevation = models.IntegerField(null=True)
    gtopo30 = models.IntegerField(null=True)
    timezone = models.CharField(max_length=40, null=True)
    moddate = models.DateField(null=True)
    


class Title(models.Model):
    title = models.TextField()
    signed_author = models.TextField(blank=True, null=True)
    pseudonym = models.CharField(max_length=255, blank=True, null=True)
    imprint = models.TextField(blank=True, null=True)
    colophon = models.TextField(blank=True, null=True)
    location_of_printing = models.IntegerField(blank=True, null=True)
    pubdate = models.CharField(max_length=60, blank=True, null=True)
    date_of_first_publication = models.CharField(max_length=40, blank=True, null=True)
    format_id = models.IntegerField(blank=True, null=True)
    size_l = models.IntegerField(blank=True, null=True)
    size_w = models.IntegerField(blank=True, null=True)
    edition = models.CharField(max_length=200, blank=True, null=True)
    volumes = models.IntegerField(blank=True, null=True)
    pagination = models.CharField(max_length=400, blank=True, null=True)
    price_pound = models.IntegerField(blank=True, null=True)
    price_shilling = models.IntegerField(blank=True, null=True)
    price_pence = models.DecimalField(max_digits=9, decimal_places=1, blank=True, null=True)
    shelfmark = models.TextField(blank=True, null=True)
    checked = models.BooleanField(default=False)
    finalattempt = models.BooleanField(default=False)
    finalcheck = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    selfpublished = models.BooleanField(default=False)
    edition_number = models.IntegerField(blank=True, null=True)
    price_total = models.IntegerField()
    copyright = models.TextField(blank=True, null=True)
    other_currency_id = models.IntegerField(blank=True, null=True)
    other_price = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    edition_checked = models.BooleanField(default=False)
    created = models.DateTimeField()
    updated = models.DateTimeField()
    


class Firm(models.Model):
    name = models.CharField(max_length=255, null=True)
    street_address = models.TextField(null=True)
    city = models.ForeignKey(Geonames, on_delete=models.CASCADE, null=True)
    start_date = models.CharField(max_length=4, null=True)
    end_date = models.CharField(max_length=4, null=True)
    finalcheck = models.BooleanField(default=False)
    gender = models.CharField(max_length=1, choices=[('U', 'Unknown'), ('M', 'Male'), ('F', 'Female')], default='U')
    notes = models.TextField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (('name', 'city', 'start_date', 'end_date'),)

class Person(models.Model):
    last_name = models.CharField(max_length=100, null=True)
    first_name = models.CharField(max_length=100, null=True)
    title = models.CharField(max_length=200, null=True)
    gender = models.CharField(max_length=1, choices=(('M', 'Male'), ('F', 'Female'), ('U', 'Unknown')), default='U')
    dob = models.CharField(max_length=20, null=True)
    dod = models.CharField(max_length=20, null=True)
    city_id_of_birth = models.ForeignKey(Geonames, on_delete=models.SET_NULL, related_name='people_born', null=True)
    city_id_of_death = models.ForeignKey(Geonames, on_delete=models.SET_NULL, related_name='people_died', null=True)
    viaf_permalink = models.CharField(max_length=127, null=True)
    wikipedia_link = models.CharField(max_length=127, null=True)
    image_link = models.CharField(max_length=255, null=True)
    finalcheck = models.BooleanField(default=False)
    notes = models.TextField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"        
class Role(models.Model):
    name = models.TextField(null=True)
    description = models.TextField(null=True)
    

class TitleRole(models.Model):
    title = models.ForeignKey(Title, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = (('title', 'person', 'role'),)

    
class PersonFirm(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    firm = models.ForeignKey(Firm, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['person', 'firm'], name='person_firm_uniq')
        ]

class Currency(models.Model):
    code = models.CharField(max_length=3, null=True)
    name = models.CharField(max_length=64)
    symbol = models.CharField(max_length=4, null=True)
    description = models.TextField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "currencies"

class FirmRole(models.Model):
    name = models.TextField(null=True)
    description = models.TextField(null=True)
    

class TitleFirmRole(models.Model):
    title = models.ForeignKey(Title, on_delete=models.CASCADE)
    firmrole = models.ForeignKey(FirmRole, on_delete=models.CASCADE)
    firm = models.ForeignKey(Firm, on_delete=models.CASCADE)
    

class Genre(models.Model):
    name = models.TextField(null=True)
    description = models.TextField(null=True)
