#!/usr/bin/python
#- * -coding: utf - 8 - * -

import urllib.request
import urllib.parse
import urllib.error


import requests
from bs4 import BeautifulSoup
from collections import Counter
from slugify import slugify
import ssl
import json
import re
import unidecode

import ast
import os
from urllib.request import Request, urlopen

with open('audio-features.json', 'r') as song_list:
  data = json.load(song_list)

bag_of_words_json = []

for song in data:
  artist_name = slugify(song['artistName']);
  song_name = song['name'].split("(", 1)[0]
  song_name = song_name.translate(str.maketrans({' ': '-', '\'': None, "(": None, ")": None, '’': None, "-": None}))
  url = "https://genius.com/{0}-{1}-lyrics".format(artist_name, slugify(song_name))

  print(url)
  # Request the inputted URL
  page = requests.get(url)

  # Creating a BeautifulSoup object of the html page for easy extraction of data.
  soup = BeautifulSoup(page.text, 'html.parser')
  html = soup.prettify('utf-8')

  # Objects for holding song data
  song_json = {}
  song_json["Title"] = song['name'];
  song_json["Genre"] = song['genre'];
  song_json["Lyrics"] = [];

  #Extract Title of the song
  for title in soup.findAll('title'):
    song_json["Title"] = title.text.strip()

  #Extract the Lyrics of the song
  for div in soup.findAll('div', attrs = {'class': 'lyrics'}):
    lyrics = re.sub("[\(\[].*?[\)\]]", "", div.text).strip().split("\n");
    lyrics = list(filter(None, lyrics))
    song_json["Lyrics"] = ' '.join(lyrics);

  bag_of_words_json.append(song_json)

#Save the json created with the file name as title + .json
with open('bag_of_words.json', 'w') as outfile:
  json.dump(bag_of_words_json, outfile, indent = 4, ensure_ascii = False)
