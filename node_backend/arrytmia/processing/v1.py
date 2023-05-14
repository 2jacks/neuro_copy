# %matplotlib inline
from IPython.display import display
import matplotlib.pyplot as plt

import numpy as np
import os
import shutil
import posixpath
import wfdb
from biosppy.signals import ecg
import glob
import joblib
from scipy import signal
import pandas as pd
import pathlib

import glob
from scipy import signal

folder = r'temp/*.hea'
files = glob.glob(folder)


def get_data(file):
    print(file)
    normal_sinus_rhythm = joblib.load("./normal_sinus_rhythm.joblib")
    arrhythmia = joblib.load("./arrhythmia.joblib")
    atrial_fibrillation = joblib.load("./atrial_fibrillation.joblib")
    malignant_ventricular_ectopy = joblib.load("./malignant_ventricular_ectopy.joblib")
    supraventricular_arrhythmia = joblib.load("./supraventricular_arrhythmia.joblib")
    sudden_cardiac_death = joblib.load("./sudden_cardiac_death.joblib")

    signal_list = []

    for i in range(len(file)):
        record = wfdb.rdrecord(file[:-4])
        fs = record.__dict__['fs']
        channel_number = record.__dict__['n_sig']

        for j in range(channel_number):
            signal = record.__dict__['p_signal'][:, j][0:100000]
            out = ecg.ecg(signal=signal, sampling_rate=fs, show=False)
            out_array = out['templates']

            for k in range(out_array.shape[0]):
                signal_list.append(out_array[k])

    from scipy import signal
    rescaled_list = []
    for i in range(len(signal_list)):
        rescaled_list.append(signal.resample(signal_list[i], 76))

    X = np.array(rescaled_list)
    normal_sinus_rhythm = np.mean(normal_sinus_rhythm.predict(X), axis=None)
    arrhythmia = np.mean(arrhythmia.predict(X), axis=None)
    atrial_fibrillation = np.mean(atrial_fibrillation.predict(X), axis=None)
    malignant_ventricular_ectopy = np.mean(malignant_ventricular_ectopy.predict(X), axis=None)
    supraventricular_arrhythmia = np.mean(supraventricular_arrhythmia.predict(X), axis=None)
    column_list = [file, round(normal_sinus_rhythm, 2), round(atrial_fibrillation, 2),
                   round(malignant_ventricular_ectopy, 2), round(supraventricular_arrhythmia, 2)]
    df = pd.DataFrame(np.column_stack(column_list), columns=['file name', 'normal sinus rhythm', 'atrial fibrillation',
                                                             'malignant ventricular ectopy',
                                                             'supraventricular arrhythmia'])
    return df


def get_prediction():
    data_list = []
    for i in range(len(files)):
        data_list.append(get_data(files[i]))
    return data_list
