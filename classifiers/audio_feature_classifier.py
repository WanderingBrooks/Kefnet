import json
from scipy.sparse import coo_matrix, hstack, csr_matrix
from sklearn import preprocessing, svm, metrics
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
import matplotlib.pyplot as plt
import numpy as np
import itertools


from skmultilearn.problem_transform import BinaryRelevance
from sklearn.naive_bayes import BernoulliNB

def plot_confusion_matrix(cm,
                          target_names,
                          path,
                          title='Confusion matrix',
                          cmap=None,
                          normalize=True
                          ):
    """
    given a sklearn confusion matrix (cm), make a nice plot

    Arguments
    ---------
    cm:           confusion matrix from sklearn.metrics.confusion_matrix

    target_names: given classification classes such as [0, 1, 2]
                  the class names, for example: ['high', 'medium', 'low']

    title:        the text to display at the top of the matrix

    cmap:         the gradient of the values displayed from matplotlib.pyplot.cm
                  see http://matplotlib.org/examples/color/colormaps_reference.html
                  plt.get_cmap('jet') or plt.cm.Blues

    normalize:    If False, plot the raw numbers
                  If True, plot the proportions

    Usage
    -----
    plot_confusion_matrix(cm           = cm,                  # confusion matrix created by
                                                              # sklearn.metrics.confusion_matrix
                          normalize    = True,                # show proportions
                          target_names = y_labels_vals,       # list of names of the classes
                          title        = best_estimator_name) # title of graph

    Citiation
    ---------
    http://scikit-learn.org/stable/auto_examples/model_selection/plot_confusion_matrix.html

    """

    accuracy = np.trace(cm) / float(np.sum(cm))
    misclass = 1 - accuracy

    if cmap is None:
        cmap = plt.get_cmap('Blues')

    plt.figure(figsize=(8, 6))
    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()

    if target_names is not None:
        tick_marks = np.arange(len(target_names))
        plt.xticks(tick_marks, target_names, rotation=45)
        plt.yticks(tick_marks, target_names)

    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]


    thresh = cm.max() / 1.5 if normalize else cm.max() / 2
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        if normalize:
            plt.text(j, i, "{:0.4f}".format(cm[i, j]),
                     horizontalalignment="center",
                     color="white" if cm[i, j] > thresh else "black")
        else:
            plt.text(j, i, "{:,}".format(cm[i, j]),
                     horizontalalignment="center",
                     color="white" if cm[i, j] > thresh else "black")


    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel
    plt.savefig(path)


def get_labels_and_features(data):
  labels = []
  audio_features = []
  genre_types = []
  lyrics = []

  for track in data:
    genres_encoded = []
    for genre in track['genres']:
      if genre not in genre_types:
        genre_types.append(genre)

    
    if 'pop' in track['genres']:
      genres_encoded.append(1)
    else:
      genres_encoded.append(0)

    if 'rap' in track['genres']:
      genres_encoded.append(1)
    else:
      genres_encoded.append(0)

    if 'rock' in track['genres']:
      genres_encoded.append(1)
    else:
      genres_encoded.append(0)

    labels.append(genres_encoded)
    lyrics.append(track['lyrics'])
    audio_features.append(list(track['audioFeatures'].values()))

  return labels, audio_features, lyrics, genre_types

f = open("./features.json", "r")

audio_features = json.loads(f.read())

labels, audio_features, lyrics, genre_types = get_labels_and_features(audio_features)

count_vect = CountVectorizer()
tfidf_transformer = TfidfTransformer()
counts = count_vect.fit_transform(lyrics)
tfidf = tfidf_transformer.fit_transform(counts)

features = hstack([tfidf, coo_matrix(audio_features)])

# Encode genres
le = preprocessing.LabelEncoder()

#genres_encoded = le.fit_transform(labels)
genres_sparse = csr_matrix(labels)

# Split Data
x_train, x_test, y_train, y_test = train_test_split(features, genres_sparse, test_size=0.3, shuffle=True)

# initialize binary relevance multi-label classifier
# with a gaussian naive bayes base classifier
classifier = BinaryRelevance(BernoulliNB())

# train
classifier.fit(x_train, y_train)

# predict
y_pred = classifier.predict(x_test)

# accuracy
print(metrics.classification_report(y_test, y_pred))
confusion_matrix  = metrics.multilabel_confusion_matrix(y_test, y_pred)

plot_confusion_matrix(confusion_matrix[0], target_names=['pop', 'not pop'], path='./pop', cmap=plt.get_cmap('Blues'))
plot_confusion_matrix(confusion_matrix[1], target_names=['rap', 'not rap'], path='./rap', cmap=plt.get_cmap('Blues'))
plot_confusion_matrix(confusion_matrix[2], target_names=['rock', 'not rock'], path='./rock', cmap=plt.get_cmap('Blues'))