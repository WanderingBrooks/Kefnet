#!/usr/bin/python
#- * -coding: utf - 8 - * -

import urllib.request
import urllib.parse
import urllib.error
import requests
from bs4 import BeautifulSoup
from collections import Counter
import ssl
import json
import ast
import os
from urllib.request import Request, urlopen

# Input genius URL
url = input('Enter Genius song lyrics Url: ')

# Request the inputted URL
page = requests.get(url)

# Creating a BeautifulSoup object of the html page for easy extraction of data.
soup = BeautifulSoup(page.text, 'html.parser')
html = soup.prettify('utf-8')
# Objects for holding song data
song_json = {}
song_json["Lyrics"] = [];
song_json["Words"] = [];
song_json["Stats"] = [];
full_lyrics = [];

#Extract Title of the song
for title in soup.findAll('title'):
  song_json["Title"] = title.text.strip()

#Extract the Lyrics of the song
for div in soup.findAll('div', attrs = {'class': 'lyrics'}):
  song_json["Lyrics"].append(div.text.strip().split("\n"));
  song_json["Words"].append(div.text.strip().split());

#Extract bag-of-words statistics about the song
song_json["Stats"] = Counter(song_json["Words"][0]).most_common();

#Save the json created with the file name as title + .json
with open(song_json["Title"] + '.json', 'w') as outfile:
  json.dump(song_json, outfile, indent = 4, ensure_ascii = False)
