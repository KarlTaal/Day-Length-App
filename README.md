# Päeva pikkuse veebirakendus

## Üldist infot

Kodutöö alguses sain aru, et lahendus tuleb ühe leheküljeline ja sellepoolest üsna otsekohene. Selletõttu otsustasin proovida uut raamistikku, millega kogemus seni puudus. Otsustasin veebilehe realiseerida Django raamistikuga. Vaadates mõnda YouTube tutorialit, sain ma projekti kiiresti püsti ja sain hakata funktsionaalsust implementeerima. Veebirakenduse tegemiseks läks mul aega umbkaudu 2-3 päeva, tehes iga päev paar tunnikest tööd. Lisafunktsioonina lisasin veebilehele ka võimaluse kuvatava keele muutmise.


## Heroku
Kui veebileht valmis oli, siis panin selle ka Herokusse ülesse ja hetkel pääseb veebilehele ligi järgmise lingiga: https://immense-peak-16244.herokuapp.com/ 


## Kellaaegade arvutamine
Alguses arvasin naiivselt, et ülesanne on üsna lihtne. Peale natukest internetis uurimist päikesetõusu ja päikeseloojangu arvutamise kohta mu arvamus muutus. Sain teada, et selle arvutamine ei olegi nii lihtne, kui kõlab. Peale mitme lehekülje uurimist, otsustasin implementeerida valemi, mis on välja toodud Global Monitoring Laboratory leheküljel, https://www.esrl.noaa.gov/gmd/grad/solcalc/. Sealt leidsin ma exceli faili, kus oli implementeeritud täpselt see valem, mida mul vaja oli. Minu töö oli see nüüd ümber kirjutada enda veebilehele. Kuna arvutusi oli palju, siis olid ka vead kerged tulema, kuid peale mõningat parandamist töötas kõik täpselt nii nagu loodetud.


## Kasutatud töövahendid
Python, versioon 3.7.6- https://www.python.org/downloads/release/python-376/   
Django, versioon 3.0.5

Veebilehe käivitamiseks peavad olemas olema nii Python kui ka Django paigaldatud, soovitavalt eelmainitud versioonid. Kui need on installitud, siis piisab projekti kaustas käsureal sisestada käsk "python manage.py runserver". Veebilehte vaadeldes on vajalik ka interneti ühendus, sest muidu ei ilmu mõned funktsionaalsused veebilehele, nagu näiteks kaart.
